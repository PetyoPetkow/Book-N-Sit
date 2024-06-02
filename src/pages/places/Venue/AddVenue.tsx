import { Button, Divider, InputLabel, TextField } from '@mui/material';
import { FC } from 'react';

import AddressAutocomplete from './AddressAutocomplete';
import WorkigHoursPicker from './WorkingHours/WorkingHoursPicker';
import InputFileUpload from './Images/UploadImages';

const AddVenue: FC<AddVenueProps> = () => {
  return (
    <div className="flex align-middle justify-center items-center w-full">
      <div className="w-11/12 h-fit my-16 bg-white border-2 border-solid border-gray-200 p-10">
        <div className="flex flex-col gap-5 ">
          <div className="text-5xl">Register you venue</div>
          <div>Please fill out the form with relevant information about your venue.</div>
        </div>
        <Divider className="my-5" />
        <div className="flex flex-col gap-5">
          <div className="flex gap-10">
            <div className="flex-1 ">
              <InputLabel required>Name</InputLabel>
              <TextField required fullWidth />
            </div>
            <div className="flex-1 ">
              <AddressAutocomplete />
            </div>
          </div>
          <div>
            <InputFileUpload />
          </div>
          <div>
            <InputLabel>Description</InputLabel>
            <TextField
              className="w-full"
              rows={5}
              multiline
              // inputProps={{ maxLength: maxCommentLength }}
              value={'comment'}
              // onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <div>
            <WorkigHoursPicker />
          </div>
          <div className="flex justify-end gap-5">
            <Button color="success" variant="contained">
              Publish
            </Button>
            <Button color="error" variant="contained">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddVenueProps {}

export default AddVenue;
