import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); //

export const uploadRouter = {


    profilePicture: f(["image"])
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),
}