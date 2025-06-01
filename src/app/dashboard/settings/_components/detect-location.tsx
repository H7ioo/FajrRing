"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { AddressType } from "@googlemaps/google-maps-services-js";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { LocationData } from "./address-autocomplete-input";

interface DetectLocationProps {
  onLocationDetected: (location: LocationData) => void;
  disabled?: boolean;
  className?: string;
}

export function DetectLocation({
  onLocationDetected,
  disabled = false,
  className,
}: DetectLocationProps) {
  const [isDetecting, setIsDetecting] = useState(false);

  // tRPC mutation to get address from coordinates
  const getAddressMutation = api.geo.getAddress.useMutation({
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const result = data[0];
        if (result) {
          // Extract city and country from address components
          let city = "";
          let country = "";
          const formattedAddress = result.formatted_address ?? "";

          if (result.address_components) {
            for (const component of result.address_components) {
              const types = component.types;
              if (types.includes(AddressType.locality)) {
                city = component.long_name;
              } else if (
                types.includes(AddressType.administrative_area_level_1)
              ) {
                if (!city) city = component.long_name;
              } else if (types.includes(AddressType.country)) {
                country = component.long_name;
              }
            }
          }

          const locationData: LocationData = {
            placeId: result.place_id || "",
            displayName: city || formattedAddress,
            formattedAddress,
            city,
            country,
            latitude: result.geometry?.location?.lat || 0,
            longitude: result.geometry?.location?.lng || 0,
          };

          onLocationDetected(locationData);

          toast.success("Location detected", {
            description: `Your location has been updated to ${city}${
              country ? `, ${country}` : ""
            }`,
          });
        } else {
          toast.error("Location detection failed", {
            description: "Could not determine your address from coordinates",
          });
        }
      } else {
        toast.error("Location detection failed", {
          description: "No address found for your location",
        });
      }
      setIsDetecting(false);
    },
    onError: (error) => {
      console.error("Reverse geocoding error:", error);
      toast.error("Location detection failed", {
        description: "Failed to get address from coordinates",
      });
      setIsDetecting(false);
    },
  });

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support location detection",
      });
      return;
    }

    setIsDetecting(true);

    // Show initial toast
    toast.info("Detecting location", {
      description: "Please allow location access when prompted",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        getAddressMutation.mutate({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        setIsDetecting(false);

        const errorMessage = "Failed to detect your location";
        let errorDescription = "";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorDescription =
              "Location access was denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorDescription =
              "Location information is unavailable. Please try again later.";
            break;
          case error.TIMEOUT:
            errorDescription = "Location request timed out. Please try again.";
            break;
          default:
            errorDescription =
              "An unknown error occurred while detecting location.";
            break;
        }

        toast.error(errorMessage, {
          description: errorDescription,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds timeout
        maximumAge: 300000, // 5 minutes cache
      },
    );
  };

  return (
    <Button
      type="button"
      onClick={handleDetectLocation}
      className={className}
      loading={isDetecting || disabled}
    >
      <MapPin className="mr-2 h-4 w-4" />
      Detect My Location
    </Button>
  );
}
