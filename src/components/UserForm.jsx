"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage("Name and email are required.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "users"), {
        name: trimmedName,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("User details saved successfully.");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error saving user data:", error);
      setErrorMessage("Failed to save user details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-white/30 bg-white/15 p-6 backdrop-blur-xl shadow-2xl"
    >
      <h1 className="text-2xl font-bold text-white">Create User</h1>
      <p className="mt-1 text-sm text-white/80">Save your details to Firestore</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-white">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-white/35 bg-white/90 px-3 py-2 text-slate-900 outline-none ring-blue-500 transition focus:ring-2"
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/35 bg-white/90 px-3 py-2 text-slate-900 outline-none ring-blue-500 transition focus:ring-2"
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {errorMessage ? <p className="mt-4 text-sm text-red-200">{errorMessage}</p> : null}
      {successMessage ? <p className="mt-4 text-sm text-emerald-200">{successMessage}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save User"}
      </button>
    </form>
  );
}