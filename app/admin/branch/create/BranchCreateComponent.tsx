'use client';

import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, useEffect } from 'react';

// Define Interface for Form State
interface BranchFormData {
  fname: string;
  passport: File | null;
  blood: string;
  mobile: string;
  emobile: string;
  email: string;
  otp: string;
  acc: string;
  ifsc: string;
  acc_name: string;
  nominame: string;
  nomirel: string;
  nominum: string;
  nomiemail: string;
  bname: string;
  btype: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  landmark: string;
  bmobile: string;
  img: File | null;
  maplink: string;
  g1name: string;
  g1num: string;
  g1email: string;
}

export default function AddBranchForm() {
  const router = useRouter();
  // 1. Single unified state object for text/select/file fields
  const [formData, setFormData] = useState<BranchFormData>({
    fname: '',
    passport: null,
    blood: '',
    mobile: '',
    emobile: '',
    email: '',
    otp: '',
    acc: '',
    ifsc: '',
    acc_name: '',
    nominame: '',
    nomirel: '',
    nominum: '',
    nomiemail: '',
    bname: '',
    btype: 'State Branch',
    state: '',
    district: '',
    taluk: '',
    village: '',
    landmark: '',
    bmobile: '',
    img: null,
    maplink: '',
    g1name: '',
    g1num: '',
    g1email: '',
  });

  // 2. UI Control State
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState(false);

  const [states, setStates] = useState<{ state_name: string, state_id: string }[]>([]);
  const [districts, setDistricts] = useState<{ district_name: string, district_id: string }[]>([]);
  const [taluks, setTaluks] = useState<{ taluk_name: string, taluk_id: string }[]>([]);
  const [villages, setVillages] = useState<{ village_name: string }[]>([]);

  // General Text / Select Input Handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // File Input Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Basic file size check (< 256KB for images)
      const file = files[0];
      if (file.size > 256 * 1024) {
        alert('File size exceeds maximum limit of 256KB.');
        e.target.value = ''; // Reset input
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  // Trigger OTP logic
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert('Please enter a valid personal email address first.');
      return;
    }
    try {
      const res = await fetch('/api/admin/branch/sendOTP', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email })
      });
      if (!res.ok) {
        throw new Error('Failed to send OTP');
      }
      setOtpSentMessage(true);
      setShowOtpSection(true);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Please try again later.');
    }
  };

  // Verify OTP logic
  const handleVerifyOtp = async () => {
    if (formData.otp.length >= 4) {
      try {
        const res = await fetch('/api/admin/branch/verifyOTP', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, otp: formData.otp })
        });
        if (!res.ok) {
          throw new Error('Failed to verify OTP');
        }
        const data = await res.json();
        if (!data.success) {
          alert(data.message || 'OTP verification failed.');
          return;
        }
        setIsOtpVerified(true);
        alert('Email OTP verified successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to verify OTP. Please try again later.');
      }
    } else {
      alert('Please enter a valid OTP.');
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert('Please verify your email address via OTP before submitting.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value);
        }
      });
      const res = await fetch('/api/admin/branch/create', {
        method: 'POST',
        body: formDataToSend
      });
      if (!res.ok) {
        throw new Error('Failed to submit branch details');
      }
      alert('Branch created successfully!');
      router.push("/admin")
    } catch (error) {
      console.error(error);
      alert('Failed to submit branch details. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/admin/branch/fetchStates");
        if (res.ok) {
          const data = await res.json();
          setStates(data);
        }
      } catch (error) {
        console.error(error);
        alert("Server Error!");
      }
    };
    fetchState();
  }, []);
  
  const fetchDistricts = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredStates = states.filter((state) => state.state_name === e.target.value)[0];
    try {
        const res = await fetch("/api/admin/branch/fetchDistricts", {
            method: "POST",
            body: JSON.stringify({ state_id: filteredStates.state_id })
        });
        if (res.ok) {
          const data = await res.json();
          setDistricts(data);
        }
      } catch (error) {
        console.error(error);
        alert("Server Error!");
      }
  }
  const fetchTaluks = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredDistricts = districts.filter((district) => district.district_name === e.target.value)[0];
    try {
        const res = await fetch("/api/admin/branch/fetchTaluks", {
            method: "POST",
            body: JSON.stringify({ district_id: filteredDistricts.district_id })
        });
        if (res.ok) {
          const data = await res.json();
          setTaluks(data);
        }
      } catch (error) {
        console.error(error);
        alert("Server Error!");
      }
  }
  const fetchVillages = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredTaluks = taluks.filter((taluk) => taluk.taluk_name === e.target.value)[0];
    try {
        const res = await fetch("/api/admin/branch/fetchVillages", {
            method: "POST",
            body: JSON.stringify({ taluk_id: filteredTaluks.taluk_id })
        });
        if (res.ok) {
          const data = await res.json();
          setVillages(data);
        }
      } catch (error) {
        console.error(error);
        alert("Server Error!");
      }
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 sm:p-10 bg-white rounded-2xl shadow-xl border border-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight text-center sm:text-left">
          Add New Branch
        </h2>
        <p className="text-sm text-slate-500 mt-1 text-center sm:text-left">
          Fill out the required information below to register a new branch
          office.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Branch Head Personal Details */}
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
            1. Branch Head Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="fname"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Branch Head&apos;s Full Name (as per ID card){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                required
                placeholder="Enter full legal name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            {/* Passport Photo */}
            <div>
              <label
                htmlFor="passport"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Passport Size Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="passport"
                name="passport"
                accept=".jpeg,.jpg"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-300 rounded-lg p-1"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                JPG / JPEG format only, max 256KB
              </span>
            </div>

            {/* Blood Group */}
            <div>
              <label
                htmlFor="blood"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                id="blood"
                name="blood"
                value={formData.blood}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all bg-white"
              >
                <option value="">Select Blood Group</option>
                <option value="A +Ve">A +Ve</option>
                <option value="A -Ve">A -Ve</option>
                <option value="B +Ve">B +Ve</option>
                <option value="B -Ve">B -Ve</option>
                <option value="AB +Ve">AB +Ve</option>
                <option value="AB -Ve">AB -Ve</option>
                <option value="O +Ve">O +Ve</option>
                <option value="O -Ve">O -Ve</option>
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Permanent Phone Number (Personal){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                minLength={10}
                maxLength={10}
                required
                placeholder="10-digit phone number"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label
                htmlFor="emobile"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Emergency Phone Number & Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="emobile"
                name="emobile"
                value={formData.emobile}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe (Brother) - 9876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            {/* Email + OTP Verification */}
            <div className="md:col-span-2 space-y-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address (Personal) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpVerified}
                  className={`px-5 py-2.5 text-white font-medium text-sm rounded-lg transition-colors shadow-sm whitespace-nowrap ${
                    isOtpVerified
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isOtpVerified ? "OTP Verified" : "Send OTP"}
                </button>
              </div>

              {showOtpSection && !isOtpVerified && (
                <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
                  {otpSentMessage && (
                    <p className="text-xs text-indigo-700 font-medium">
                      Note: OTP will be received in your email within 2 minutes.
                      Please wait!
                    </p>
                  )}
                  <div className="flex gap-3 flex-col sm:flex-row">
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter OTP Received in Email"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Personal Bank Account Details */}
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
            2. Personal Bank Account Details (S.B. A/c)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="acc"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="acc"
                name="acc"
                value={formData.acc}
                onChange={handleChange}
                required
                placeholder="Account Number"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="ifsc"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ifsc"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                required
                placeholder="IFSC Code"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all uppercase"
              />
            </div>
            <div>
              <label
                htmlFor="acc_name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Name as on Account <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="acc_name"
                name="acc_name"
                value={formData.acc_name}
                onChange={handleChange}
                required
                placeholder="Name as on Account"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Nominee Details */}
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
            3. Candidate&apos;s Nominee Details (Permanent)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nominame"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nominee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nominame"
                name="nominame"
                value={formData.nominame}
                onChange={handleChange}
                required
                placeholder="Nominee Name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="nomirel"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Relationship with Nominee{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nomirel"
                name="nomirel"
                value={formData.nomirel}
                onChange={handleChange}
                required
                placeholder="Relationship with Nominee"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="nominum"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nominee&apos;s Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="nominum"
                name="nominum"
                value={formData.nominum}
                onChange={handleChange}
                required
                placeholder="Nominee's Phone Number"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="nomiemail"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nominee&apos;s Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="nomiemail"
                name="nomiemail"
                value={formData.nomiemail}
                onChange={handleChange}
                required
                placeholder="Nominee's Email ID"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Branch Office Location & Info */}
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
            4. Branch Office Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="bname"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Branch Office Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="bname"
                name="bname"
                value={formData.bname}
                onChange={handleChange}
                required
                placeholder="BRANCH OFFICE NAME"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="btype"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Select Branch Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="btype"
                name="btype"
                value={formData.btype}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 text-sm outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Select State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  fetchDistricts(e);
                }}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all bg-white"
              >
                <option value="">Select State</option>
                {states.length > 0
                  ? states.map((state) => (
                      <option value={state.state_name} key={state.state_name}>
                        {state.state_name}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Select District <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  fetchTaluks(e);
                }}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all bg-white"
              >
                <option value="">Select District</option>
                {districts.length > 0
                  ? districts.map((district) => (
                      <option value={district.district_name} key={district.district_name}>
                        {district.district_name}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div>
              <label
                htmlFor="taluk"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Select Taluk / Tehsil <span className="text-red-500">*</span>
              </label>
              <select
                id="taluk"
                name="taluk"
                value={formData.taluk}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  fetchVillages(e);
                }}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all bg-white"
              >
                <option value="">Select Taluk / Tehsil</option>
                {taluks.length > 0
                  ? taluks.map((taluk) => (
                      <option value={taluk.taluk_name} key={taluk.taluk_name}>
                        {taluk.taluk_name}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div>
              <label
                htmlFor="village"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Select City / Village
              </label>
              <select
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all bg-white"
              >
                <option value="">Select City / Village</option>
                {villages.length > 0
                  ? villages.map((village, index) => (
                      <option value={village.village_name} key={`${village.village_name}-${index}`}>
                        {village.village_name}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Enter Landmark <span className="text-red-500">*</span>
              </label>
              <textarea
                id="landmark"
                name="landmark"
                rows={3}
                value={formData.landmark}
                onChange={handleChange}
                required
                placeholder="Enter Landmark"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="bmobile"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Branch Office Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="bmobile"
                name="bmobile"
                value={formData.bmobile}
                onChange={handleChange}
                required
                placeholder="BRANCH OFFICE PHONE NUMBER"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="img"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Upload Branch Photo with Company Logo
              </label>
              <input
                type="file"
                id="img"
                name="img"
                accept=".jpeg,.jpg"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-300 rounded-lg p-1"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                MAX Image Size (256KB) & Landscape format only.
              </span>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="maplink"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Office Location Map Link <span className="text-red-500">*</span>
              </label>
              <textarea
                id="maplink"
                name="maplink"
                rows={2}
                value={formData.maplink}
                onChange={handleChange}
                required
                placeholder="OFFICE LOCATION MAP LINK"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Introducer Details */}
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
            5. Introducer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="g1name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="g1name"
                name="g1name"
                value={formData.g1name}
                onChange={handleChange}
                required
                placeholder="Name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="g1num"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="g1num"
                name="g1num"
                value={formData.g1num}
                onChange={handleChange}
                required
                placeholder="PHONE NUMBER"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="g1email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="g1email"
                name="g1email"
                value={formData.g1email}
                onChange={handleChange}
                required
                placeholder="EMAIL ID"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Form Action */}
        <div className="pt-4">
          <button
            disabled={!isOtpVerified}
            type="submit"
            className="w-full disabled:bg-indigo-300 disabled:cursor-not-allowed py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all focus:ring-4 focus:ring-indigo-100"
          >
            Create Branch
          </button>
        </div>
      </form>
    </div>
  );
}