import { ChangeEvent, useRef } from 'react';
import { GradientButton } from 'ui';
import { v4 } from 'uuid';

import { Add } from '@styled-icons/material-outlined';

import { FileInput } from './style';

type UploadProps = {
  multiple?: boolean;
  accept?: string;
  onImageSelect?: (images: { id: string; file: File }[]) => void;
};

const ImageUpload = (props: UploadProps) => {
  const { onImageSelect, multiple, accept = '.png, .jpg, .jpeg, .gif, .svg' } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget?.files;
    if (files && files.length > 0) {
      onImageSelect?.(Array.from(files).map((f) => ({ id: v4(), file: f })));
    }
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <FileInput
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onFileChange}
      />
      <GradientButton type="button" onClick={selectImage}>
        <Add size={24} />
      </GradientButton>
    </>
  );
};

export default ImageUpload;
