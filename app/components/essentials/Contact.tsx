import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { UploadCloud } from "lucide-react";

export default function Contact() {
  const IMGBB_KEY = "222e573c91bea794c21c7d5a1550cc41";

  const form = useRef<HTMLFormElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const uploadImages = async (selectedFiles: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const body = new FormData();

      body.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        {
          method: "POST",
          body,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Image upload failed.");
      }

      uploadedUrls.push(data.data.url);
    }

    return uploadedUrls;
  };

  const sendEmail = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formElement = form.current;

      if (!formElement) {
        throw new Error("Form not found");
      }

      // basic validation
      const formData = new FormData(formElement);

      if (
        !formData.get("first_name") ||
        !formData.get("email") ||
        !formData.get("subject") ||
        !formData.get("description")
      ) {
        setError("Please fill all required fields.");
        setLoading(false);
        return;
      }

      // upload images first
      let uploadedUrls: string[] = [];

      if (files.length > 0) {
        uploadedUrls = await uploadImages(files);
      }

      // send email
      await emailjs.send(
        "service_ncpeugm",
        "template_1nmerw9",
        {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          email: formData.get("email"),
          store_url: formData.get("store_url"),
          subject: formData.get("subject"),
          description: formData.get("description"),
          uploaded_images: uploadedUrls.join("\n"),
        },
        "tHO9m4-0eWuS_3o0Q"
      );

      setSuccess("Thank you! We’ve received your message.");

      formElement.reset();
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  emailjs.init("tHO9m4-0eWuS_3o0Q");
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
        Contact Us
      </h1>

      <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
        Have questions or need support? We're here to help.
      </p>

      <div className="mt-2 rounded-xl bg-stone-50 p-8 dark:bg-stone-800/50">
        <form ref={form} onSubmit={sendEmail} className="space-y-4">

          {/* ERROR MESSAGE */}
          {error && (
            <p className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                First name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Last name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="store_url" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Store URL
            </label>
            <input
              id="store_url"
              type="text"
              name="store_url"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            />
          </div>

          {/* FILE UPLOAD (MULTIPLE) */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Upload files (optional)
            </label>

            <label
              htmlFor="files"
              className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-emerald-500 dark:hover:bg-stone-800"
            >
              <UploadCloud className="mb-2 h-8 w-8 text-stone-400" />

              <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Click to upload
              </span>

              <span className="mt-1 text-xs text-stone-500">
                PNG, JPG, JPEG, GIF
              </span>

              {files.length > 0 && (
                <div className="mt-3 space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </label>

            <input
              id="files"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.gif,.webp"
              className="hidden"
              onChange={(e) => {
                setFiles(Array.from(e.target.files || []));
                setError("");
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            ></textarea>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer group relative overflow-hidden rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? "Sending..." : "Send Message"}
            </span>
            <span className="shine-overlay absolute inset-0 pointer-events-none" />
          </button>

          {/* SUCCESS */}
          {success && (
            <p className="mt-4 text-emerald-600 dark:text-emerald-400">
              {success}
            </p>
          )}
        </form>
      </div>
    </>
  );
}