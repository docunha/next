import { generateReactHelpers } from '@uploadthing/react';
import { OurFileRouter } from '../api/uploadthing/core';

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
