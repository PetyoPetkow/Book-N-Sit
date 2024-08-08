import { Autocomplete, InputLabel, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  city,
  onCityChanged,
  disabled = false,
}) => {
  const [options, setOptions] = useState<LocationOption[]>([]);

  const loadOptions = async (input: string): Promise<any[]> => {
    let searchResults: any[] = [];

    if (input.length > 2) {
      const resp = await fetchPlaces(input);
      searchResults = resp.results
        .filter((a: any) => a.type === 'Geography')
        .map((result: any) => {
          const { freeformAddress } = result.address;
          const { lat, lon } = result.position;
          const city = freeformAddress;
          return {
            label: city,
            coordinates: [lat, lon],
          };
        });
    }

    return searchResults;
  };

  const debouncedAddressesLoad = useCallback(
    _.debounce(async (input: string) => {
      const options = await loadOptions(input);
      setOptions(options);
    }, 500),
    [options]
  );

  useEffect(() => {
    if (city) debouncedAddressesLoad(city);
  }, [city]);

  const fetchPlaces = async (query: string) => {
    const apiKey = 'hFLA6aqhOK334yS63ZzslexGAhWomWrA';
    const response: AxiosResponse<any, AxiosError> = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${query}.json?storeResult=false&countrySet=BG&view=Unified&key=${apiKey}`
    );
    return response.data;
  };

  return (
    <>
      <InputLabel>Address</InputLabel>
      <Autocomplete
        disabled={disabled}
        clearOnBlur={false}
        options={options}
        onInputChange={(sss, value) => {
          value ? debouncedAddressesLoad(value) : setOptions([]);
        }}
        onChange={(event, newValue) => {
          const city = newValue?.label || null;
          const coordinates = newValue?.coordinates || null;
          onCityChanged(city, coordinates);
        }}
        filterOptions={(options, state) => options}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
    </>
  );
};

interface LocationOption {
  label: string;
  coordinates: [number, number];
}

interface AddressAutocompleteProps {
  city: string | null;
  onCityChanged: (city: string | null, coordinates: [number, number] | null) => void;
  disabled?: boolean;
}

export default AddressAutocomplete;
