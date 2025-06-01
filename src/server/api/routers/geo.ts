import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Client, Status } from "@googlemaps/google-maps-services-js";
import { PlacesClient } from "@googlemaps/places"; // Using the new Places API Client

const legacyGoogleMapsClient = new Client(); // For older methods if needed
const placesClient = new PlacesClient({
  apiKey: env.GOOGLE_MAPS_SECRET,
});

export const geoRouter = createTRPCRouter({
  getCoordinates: protectedProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const { address } = input;
      const response = await legacyGoogleMapsClient.geocode({
        params: {
          key: env.GOOGLE_MAPS_SECRET,
          address,
        },
      });
      if (response.data.status !== Status.OK) {
        console.error("Geocode error:", response.data.error_message);
        throw new Error(`Failed to get coordinates: ${response.data.status}`);
      }
      return response.data.results;
    }),

  getAddress: protectedProcedure
    .input(z.object({ lat: z.number(), lng: z.number() }))
    .mutation(async ({ input }) => {
      const { lat, lng } = input;
      const response = await legacyGoogleMapsClient.reverseGeocode({
        params: {
          key: env.GOOGLE_MAPS_SECRET,
          latlng: { lat, lng },
        },
      });
      if (response.data.status !== Status.OK) {
        console.error("Reverse geocode error:", response.data.error_message);
        throw new Error(`Failed to get address: ${response.data.status}`);
      }
      return response.data.results;
    }),

  getTimezone: protectedProcedure
    .input(z.object({ lat: z.number(), lng: z.number() }))
    .query(async ({ input }) => {
      try {
        const response = await legacyGoogleMapsClient.timezone({
          params: {
            key: env.GOOGLE_MAPS_SECRET,
            location: { lat: input.lat, lng: input.lng },
            timestamp: Math.floor(Date.now() / 1000),
          },
        });

        if (response.data.status !== Status.OK) {
          console.error("Timezone API error:", response.data.error_message);
          throw new Error(`Failed to get timezone: ${response.data.status}`);
        }

        return {
          timeZoneId: response.data.timeZoneId,
          timeZoneName: response.data.timeZoneName,
          rawOffset: response.data.rawOffset,
          dstOffset: response.data.dstOffset,
        };
      } catch (error) {
        console.error("Timezone processing error:", error);
        throw new Error("Failed to fetch timezone information");
      }
    }),

  placesAutocomplete: protectedProcedure
    .input(
      z.object({
        input: z.string().min(1),
        // sessionToken: z.string().optional(), // TODO: Generate and pass from client
      }),
    )
    .query(async ({ input }) => {
      try {
        const request = {
          input: input.input,
          // Requesting broader types to get countries and major cities/regions
          includedPrimaryTypes: [
            "country",
            "locality",
            "administrative_area_level_1",
          ],
          includeQueryPredictions: false, // Focus on actual places
          languageCode: "en",
          // sessionToken: input.sessionToken, // TODO: Use session token
        };

        const response = await placesClient.autocompletePlaces(request, {
          otherArgs: {
            headers: {
              // Request 'types' to understand the nature of the suggestion
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.types",
            },
          },
        });

        if (!response[0]?.suggestions) {
          return [];
        }

        const suggestions = response[0].suggestions
          .filter((suggestion) => suggestion.placePrediction) // Ensure placePrediction exists
          .slice(0, 5) // Limit to 5 suggestions for cleaner UI
          .map((suggestion) => {
            const prediction = suggestion.placePrediction!;
            return {
              placeId: prediction.placeId ?? "",
              text: prediction.text?.text ?? "", // Google's formatted suggestion string
              types: prediction.types ?? [], // Types of the predicted place (e.g., "country", "locality")
            };
          });

        return suggestions;
      } catch (error) {
        console.error("Places autocomplete error:", error);
        throw new Error("Failed to fetch place suggestions");
      }
    }),

  placeDetails: protectedProcedure
    .input(
      z.object({
        placeId: z.string(),
        // sessionToken: z.string().optional(), // TODO: Generate and pass from client (must be same as autocomplete)
      }),
    )
    .query(async ({ input }) => {
      try {
        const placeDetailsRequest = {
          name: `places/${input.placeId}`, // Format for the new Places API
          languageCode: "en",
          // sessionToken: input.sessionToken, // TODO: Use session token
        };

        const response = await placesClient.getPlace(placeDetailsRequest, {
          otherArgs: {
            headers: {
              "X-Goog-FieldMask":
                "name,id,types,displayName,formattedAddress,location,addressComponents",
            },
          },
        });

        const place = response[0];
        if (!place) {
          throw new Error("Place not found");
        }

        let city = "";
        let country = "";
        let adminArea1 = ""; // e.g., State or Province
        const placeTypes = place.types ?? [];

        if (place.addressComponents) {
          for (const component of place.addressComponents) {
            const componentTypes = component.types ?? [];
            if (componentTypes.includes("locality")) {
              city = component.longText ?? "";
            } else if (componentTypes.includes("administrative_area_level_1")) {
              adminArea1 = component.longText ?? "";
            } else if (componentTypes.includes("country")) {
              country = component.longText ?? "";
            }
          }
        }

        // If city is empty but adminArea1 is present, consider using adminArea1 as city
        // This helps for state/province level results where 'locality' might be missing.
        if (!city && adminArea1) {
          city = adminArea1;
        }

        // Construct a cleaner displayName
        let finalDisplayName = "";
        const isCountryResult = placeTypes.includes("country");
        const isStateOrProvinceResult =
          placeTypes.includes("administrative_area_level_1") &&
          !placeTypes.includes("locality");

        if (isCountryResult && country) {
          finalDisplayName = country; // e.g., "Syria"
        } else if (city && country) {
          if (city === country) {
            // Avoid "Italy, Italy" for country results where city was mis-parsed as country name
            finalDisplayName = country;
          } else {
            finalDisplayName = `${city}, ${country}`; // e.g., "Damascus, Syria" or "California, United States" (if city became adminArea1)
          }
        } else if (isStateOrProvinceResult && adminArea1 && country) {
          finalDisplayName = `${adminArea1}, ${country}`; // e.g. "California, United States"
        } else if (country) {
          finalDisplayName = country; // Fallback if only country is found
        } else if (city) {
          finalDisplayName = city; // Fallback if only city is found (e.g. some city-states)
        } else if (place.displayName?.text) {
          finalDisplayName = place.displayName.text; // Google's suggestion
        } else {
          finalDisplayName = place.formattedAddress ?? ""; // Last resort
        }

        // Ensure placeId is just the ID string, not the full "places/..." name
        const extractedPlaceId = place.id
          ? place.id.substring(place.id.lastIndexOf("/") + 1)
          : input.placeId;

        return {
          placeId: extractedPlaceId,
          displayName: finalDisplayName, // Our cleaned-up display name
          formattedAddress: place.formattedAddress ?? "", // Original full address
          city: city, // Extracted city (could be adminArea1)
          country: country, // Extracted country
          latitude: place.location?.latitude ?? 0,
          longitude: place.location?.longitude ?? 0,
        };
      } catch (error) {
        console.error("Place details error:", error);
        throw new Error("Failed to fetch place details");
      }
    }),
});
