import { Autocomplete, InputLabel, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import Address from '../../../global/models/Address';

const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  address,
  onAddressChanged,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<LocationOption[]>([]);

  useEffect(() => {
    if (address) {
      setInputValue(`${address.freeformAddress}, ${address.countrySubdivision}`);
    }
  }, [address]);

  const loadOptions = async (input: string): Promise<any[]> => {
    let searchResults: any[] = [];

    if (input.length > 2) {
      const resp = await fetchPlaces(input);
      searchResults = resp.results.map((result: any) => {
        const { freeformAddress, countrySubdivision } = result.address;
        const { lat, lon } = result.position;
        const address: Address = { freeformAddress, countrySubdivision };
        return {
          label: `${freeformAddress}, ${countrySubdivision}`,
          address: address,
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
    debouncedAddressesLoad(inputValue);
  }, [inputValue]);

  const fetchPlaces = async (query: string) => {
    const apiKey = 'hFLA6aqhOK334yS63ZzslexGAhWomWrA';
    const response: AxiosResponse<any, AxiosError> = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${query}.json&countrySet=BG?key=${apiKey}`
    );
    return response.data;
  };

  return (
    <>
      <InputLabel>Address</InputLabel>
      <Autocomplete
        clearOnBlur={false}
        options={options}
        onInputChange={(event, newValue) => {
          if (event && event.type === 'change') {
            setInputValue(newValue);
          } else {
            setOptions([]);
          }
        }}
        onChange={(event, newValue) => {
          const address = newValue?.address || null;
          const coordinates = newValue?.coordinates || null;
          onAddressChanged(address, coordinates);
        }}
        inputValue={inputValue}
        filterOptions={(options, state) => options}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
    </>
  );
};

interface LocationOption {
  label: string;
  address: Address;
  coordinates: [number, number];
}

interface AddressAutocompleteProps {
  address: Address | null;
  onAddressChanged: (address: Address | null, coordinates: [number, number] | null) => void;
}

export default AddressAutocomplete;
