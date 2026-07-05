/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Search, RotateCcw } from "lucide-react";
import { IStates } from "@/types/states.interface";
import { IDistricts } from "@/types/districts.interface";
import { ITaluks } from "@/types/taluks.interface";
import { IVillages } from "@/types/villages.interface";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

type Option = {
  value: string | number;
  label: string;
};

export default function BranchSearch() {
  const [branchType, setBranchType] = useState<Option | null>(null);
  const [state, setState] = useState<Option | null>(null);
  const [district, setDistrict] = useState<Option | null>(null);
  const [taluk, setTaluk] = useState<Option | null>(null);
  const [village, setVillage] = useState<Option | null>(null);
  const [statesData, setStatesData] = useState<IStates[]>([]);
  const [districtsData, setDistrictsData] = useState<IDistricts[]>([]);
  const [taluksData, setTaluksData] = useState<ITaluks[]>([]);
  const [villagesData, setVillagesData] = useState<IVillages[]>([]);

  useLayoutEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch("/api/state");
        if (res.ok) {
          const data = await res.json();
          setStatesData(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchState();
  }, [])

  const branchTypes = [
    {
      value: "state",
      label: "State Branch",
    },
    {
      value: "district",
      label: "District Branch",
    },
    {
      value: "taluk",
      label: "Taluk / Tehsil Branch",
    },
    {
      value: "village",
      label: "City / Village Branch",
    },
  ];

  const states = useMemo(() => {
    return statesData.map((item) => ({
      value: item.state_id,
      label: item.state_name,
    }));
  }, [statesData]);

  const districtOptions = useMemo(() => {
    return districtsData.map((item) => ({
      value: item.district_id,
      label: item.district_name,
    }));
  }, [districtsData]);
  const talukOptions = useMemo(() => {
    return taluksData.map((item) => ({
      value: item.taluk_id,
      label: item.taluk_name,
    }))
  }, [taluksData]);

  const villageOptions = useMemo(() => {
     return villagesData.map((item) => ({
      value: item.village_id,
      label: item.village_name,
    }))
  }, [villagesData]);

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "56px",
      borderRadius: "16px",
      borderColor: "#e2e8f0",
      boxShadow: "none",
    }),
  };

  const handleBranchTypeChange = (value: any) => {
    setBranchType(value);

    setState(null);
    setDistrict(null);
    setTaluk(null);
    setVillage(null);
  };

  const handleReset = () => {
    setBranchType(null);
    setState(null);
    setDistrict(null);
    setTaluk(null);
    setVillage(null);
  };

  const handleSearch = () => {
    console.log({
      branchType,
      state,
      district,
      taluk,
      village,
    });

    alert("Search Triggered");
  };

  const handleStateChange = async (value: any) => {
    setState(value);
    setDistrict(null);
    setTaluk(null);
    setVillage(null);
    if (branchType?.value === "district" || branchType?.value === "taluk" || branchType?.value === "village") {
      try {
        const res = await fetch("/api/district", {
          method: "POST",
          body: JSON.stringify({ state_id: value.value }),
        });
        if (res.ok) {
          const data = await res.json();
          setDistrictsData(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
   const handleDistrictChange = async (value: any) => {
     setDistrict(value);
     setTaluk(null);
     setVillage(null);
     if (branchType?.value === "taluk" || branchType?.value === "village") {
       try {
         const res = await fetch("/api/taluk", {
           method: "POST",
           body: JSON.stringify({ district_id: value.value }),
         });
         if (res.ok) {
           const data = await res.json();
           setTaluksData(data);
         }
       } catch (error) {
         console.error(error);
       }
     }
   };
   const handleTalukChange = async (value: any) => {
     setTaluk(value);
     setVillage(null);
     if (branchType?.value === "village") {
       try {
         const res = await fetch("/api/village", {
           method: "POST",
           body: JSON.stringify({ taluk_id: value.value }),
         });
         if (res.ok) {
           const data = await res.json();
           setVillagesData(data);
         }
       } catch (error) {
         console.error(error);
       }
     }
   };

  return (
    <section
      id="branch"
      className="py-20 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full">
            <Building2 size={18} />
            Branch Offices
          </div>

          <h2 className="text-4xl font-bold mt-4">
            Find Your Branch
          </h2>

          <p className="text-slate-500 mt-2">
            Search branches by location.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <div className="grid lg:grid-cols-5 gap-4">

            {/* Branch Type */}
            <Select
              instanceId="branch-type"
              options={branchTypes}
              value={branchType}
              onChange={handleBranchTypeChange}
              placeholder="Branch Type"
              styles={selectStyles}
              isSearchable
            />

            {/* State */}
            {branchType && (
              <Select
                instanceId="state"
                options={states}
                value={state}
                onChange={handleStateChange}
                placeholder="State"
                styles={selectStyles}
                isSearchable
              />
            )}

            {/* District */}
            {(branchType?.value === "district" ||
              branchType?.value === "taluk" ||
              branchType?.value === "village") && (
              <Select
                instanceId="district"
                options={districtOptions}
                value={district}
                onChange={handleDistrictChange}
                placeholder="District"
                styles={selectStyles}
                isSearchable
                isDisabled={!state}
              />
            )}

            {/* Taluk */}
            {(branchType?.value === "taluk" ||
              branchType?.value === "village") && (
              <Select
                instanceId="taluk"
                options={talukOptions}
                value={taluk}
                onChange={handleTalukChange}
                placeholder="Taluk / Tehsil"
                styles={selectStyles}
                isSearchable
                isDisabled={!district}
              />
            )}

            {/* Village */}
            {branchType?.value === "village" && (
              <Select
                instanceId="village"
                options={villageOptions}
                value={village}
                onChange={(value: any) =>
                  setVillage(value)
                }
                placeholder="City / Village"
                styles={selectStyles}
                isSearchable
                isDisabled={!taluk}
              />
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              <Search size={18} />
              Find Branch
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-100"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/* Sample Results */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-lg">
              Udupi Branch
            </h3>

            <p className="text-slate-500 mt-2">
              Karnataka
            </p>

            <p className="text-sm mt-3">
              Branch ID:
              GIL/UPD/KA/001
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}