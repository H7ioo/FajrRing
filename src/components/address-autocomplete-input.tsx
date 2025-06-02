"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
// TODO: re-write

export interface LocationData {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: {
    timeZoneId: string;
    timeZoneName: string;
    rawOffset: number;
    dstOffset: number;
  };
}

interface AddressAutocompleteInputProps {
  value?: string;
  onLocationSelect: (location: LocationData | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function AddressAutocompleteInput({
  value = "",
  onLocationSelect,
  placeholder = "Search for a city or country...",
  label,
  disabled = false,
  className,
}: AddressAutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [currentSearchText, setCurrentSearchText] = useState(value);
  const [processingLocation, setProcessingLocation] =
    useState<LocationData | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [sessionToken, setSessionToken] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedSearchText] = useDebounce(currentSearchText, 350);

  useEffect(() => {
    setCurrentSearchText(value);
  }, [value]);

  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
  } = api.geo.placesAutocomplete.useQuery(
    { input: debouncedSearchText, sessionToken },
    {
      enabled:
        !!debouncedSearchText &&
        debouncedSearchText.length >= 2 &&
        !!sessionToken &&
        (!processingLocation ||
          (processingLocation.displayName !== debouncedSearchText &&
            processingLocation.latitude === 0)), // Allow search if current text differs from processing one AND details not yet fetched
      placeholderData: (prevData) => prevData ?? [],
    },
  );

  const {
    data: placeDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = api.geo.placeDetails.useQuery(
    { placeId: processingLocation?.placeId ?? "", sessionToken },
    {
      enabled:
        !!processingLocation?.placeId &&
        !!sessionToken &&
        processingLocation.latitude === 0,
    },
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      placeDetails &&
      processingLocation &&
      processingLocation.latitude === 0
    ) {
      const fullLocationData: LocationData = {
        placeId: processingLocation.placeId,
        displayName: placeDetails.displayName || processingLocation.displayName,
        formattedAddress:
          placeDetails.formattedAddress || processingLocation.formattedAddress,
        city: placeDetails.city || "",
        country: placeDetails.country || "",
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
        timezone: {
          timeZoneId: placeDetails.timezone.timeZoneId,
          timeZoneName: placeDetails.timezone.timeZoneName,
          rawOffset: placeDetails.timezone.rawOffset,
          dstOffset: placeDetails.timezone.dstOffset,
        },
      };
      onLocationSelect(fullLocationData);
      setProcessingLocation(null); // Done processing
      setSessionToken(""); // Clear session token - session is now terminated
      setOpen(false); // Close dropdown after successful detail fetch
    }
  }, [placeDetails, processingLocation, onLocationSelect]);

  useEffect(() => {
    if (
      debouncedSearchText.length >= 2 &&
      suggestions.length > 0 &&
      inputRef.current === document.activeElement &&
      !processingLocation && // Don't reopen if processing
      !isLoadingDetails // Don't reopen if details are loading for a selection
    ) {
      setOpen(true);
    } else if (suggestions.length === 0 && !isLoadingSuggestions) {
      // setOpen(false); // More controlled closing
    }
  }, [
    suggestions.length,
    debouncedSearchText,
    isLoadingSuggestions,
    processingLocation,
    isLoadingDetails,
  ]);

  const handleSelectSuggestion = (suggestion: {
    placeId: string;
    text: string;
  }) => {
    setCurrentSearchText(suggestion.text);
    const tempLocation: LocationData = {
      placeId: suggestion.placeId,
      displayName: suggestion.text,
      formattedAddress: suggestion.text,
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
      timezone: {
        timeZoneId: "",
        timeZoneName: "",
        rawOffset: 0,
        dstOffset: 0,
      },
    };
    setProcessingLocation(tempLocation);
    setOpen(false);
    setFocusedIndex(-1);
    // inputRef.current?.blur(); // Optional: blur after selection
  };

  const handleInputChange = (newText: string) => {
    setCurrentSearchText(newText);
    setFocusedIndex(-1);

    // Generate session token when user starts typing (first character)
    if (newText.length === 1 && !sessionToken) {
      setSessionToken(uuidv4());
    }

    // Clear session token if input is cleared
    if (newText.length === 0) {
      setSessionToken("");
    }

    if (processingLocation) {
      setProcessingLocation(null); // User is typing again, cancel current processing
    }
    if (!newText) {
      onLocationSelect(null);
      setOpen(false);
    } else if (newText.length >= 2) {
      setOpen(true); // Open if user types enough characters
    } else {
      setOpen(false); // Close if text is too short
    }
  };

  const handleInputFocus = () => {
    if (
      currentSearchText.length >= 2 &&
      (suggestions.length > 0 || isLoadingSuggestions) &&
      !processingLocation &&
      !isLoadingDetails
    ) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSelectSuggestion(suggestions[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const isLoading = isLoadingSuggestions || isLoadingDetails;
  const hasError = !!suggestionsError || !!detailsError;
  const showDropdown =
    open &&
    (suggestions.length > 0 ||
      (isLoadingSuggestions && debouncedSearchText.length >= 2) ||
      hasError) &&
    !processingLocation && // Don't show if processing a selection
    !isLoadingDetails; // Don't show if details are loading for a selection

  return (
    <FormItem className={cn("w-full", className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div ref={containerRef} className="relative">
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={currentSearchText}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoadingDetails}
              className="pl-10"
              autoComplete="off"
            />
            {(isLoadingSuggestions || isLoadingDetails) && (
              <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
            )}
          </div>

          {showDropdown && (
            <div className="border-input bg-popover text-popover-foreground absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
              {isLoadingSuggestions && debouncedSearchText.length >= 2 && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              )}

              {!isLoadingSuggestions &&
                suggestions.length === 0 &&
                debouncedSearchText.length >= 2 &&
                !hasError && (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    No locations found.
                  </div>
                )}

              {hasError && (
                <div className="text-destructive py-6 text-center text-sm">
                  Error loading suggestions. Please try again.
                </div>
              )}

              {!isLoadingSuggestions &&
                suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.placeId}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-4 py-2 text-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      focusedIndex === index &&
                        "bg-accent text-accent-foreground",
                    )}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{suggestion.text}</span>
                    </div>
                    {/* Checkmark logic can be added if needed based on a fully selected item */}
                  </div>
                ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
