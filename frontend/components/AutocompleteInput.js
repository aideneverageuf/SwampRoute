import React from 'react';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const AutocompleteInput = ({ data, placeholder, onSelectItem }) => {
  return (
    <AutocompleteDropdown
      dataSet={data}
      onSelectItem={onSelectItem}
      textInputProps={{ placeholder }}
    />
  );
};

export default AutocompleteInput;