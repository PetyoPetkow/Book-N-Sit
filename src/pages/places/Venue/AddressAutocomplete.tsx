import { Autocomplete, Button, InputLabel, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

const AddressAutocomplete: FC<AddressAutocompleteProps> = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);

  const loadOptions = async (input: string): Promise<any[]> => {
    let searchResults: any[] = [];

    if (input.length > 2) {
      const resp = await fetchPlaces(input);
      searchResults = resp.results.map((result: any) => {
        const { country, freeformAddress } = result.address;
        const position = result.position;
        const label = `${freeformAddress}, ${country}`;
        return { label: label, coordinates: [position.lat, position.lon] };
      });
    }
    console.log('sr', searchResults);
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
      `https://api.tomtom.com/search/2/geocode/${query}.json?key=${apiKey}`
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
          setSelectedOption(newValue);
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

interface AddressAutocompleteProps {}

export default AddressAutocomplete;
