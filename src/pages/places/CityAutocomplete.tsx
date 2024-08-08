import { Autocomplete, InputLabel, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

const CityAutocomplete: FC<CityAutocompleteProps> = ({ city, onCityChanged }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (city) {
      setInputValue(city);
    }
  }, [city]);

  const loadOptions = async (input: string): Promise<any[]> => {
    let searchResults: any[] = [];

    if (input.length > 2) {
      const resp = await fetchCities(input);
      searchResults = resp.results.map((result: any) => {
        const { municipality } = result.address;
        return municipality;
      });
    }
    return searchResults;
  };

  const debouncedCityesLoad = useCallback(
    _.debounce(async (input: string) => {
      const options = await loadOptions(input);
      setOptions(options);
    }, 500),
    [options]
  );

  useEffect(() => {
    debouncedCityesLoad(inputValue);
  }, [inputValue]);

  const fetchCities = async (query: string) => {
    const apiKey = 'hFLA6aqhOK334yS63ZzslexGAhWomWrA';
    const response: AxiosResponse<any, AxiosError> = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${query}.json?storeResult=false&countrySet=BG&view=Unified&entityTypeSet=Municipality&key=${apiKey}`
    );
    return response.data;
  };

  return (
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
        onCityChanged(newValue);
      }}
      inputValue={inputValue}
      filterOptions={(options, state) => options}
      renderInput={(params) => <TextField label="City" {...params} variant="outlined" />}
    />
  );
};

interface CityAutocompleteProps {
  city: string | null;
  onCityChanged: (city: string | null) => void;
}

export default CityAutocomplete;
