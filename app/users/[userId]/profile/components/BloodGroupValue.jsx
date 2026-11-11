"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getBloodGroupMaster,
  selectBloodGroupMasterData,
  selectBloodGroupMasterState,
} from "@/store/slices/masters/getBloodGroupmasterSlice";

const getBloodGroupIdentifiers = (item) =>
  [
    item?.id,
    item?.blood_group_id,
    item?.blood_group_master_id,
    item?.bloodGroupId,
    item?.value,
    item?.code,
  ]
    .filter((identifier) => identifier !== undefined && identifier !== null)
    .map((identifier) => String(identifier).trim());

const getBloodGroupLabel = (item) => {
  if (typeof item === "string") return item.trim();

  const label =
    item?.blood_group_name ??
    item?.bloodGroupName ??
    item?.name ??
    item?.label ??
    item?.group ??
    item?.blood_group;

  return label === undefined || label === null ? "" : String(label).trim();
};

export default function BloodGroupValue({ value }) {
  const dispatch = useAppDispatch();
  const masterData = useAppSelector(selectBloodGroupMasterData);
  const masterState = useAppSelector(selectBloodGroupMasterState);

  useEffect(() => {
    if (masterData.length || masterState?.loading || masterState?.error) return;
    dispatch(getBloodGroupMaster());
  }, [dispatch, masterData.length, masterState?.error, masterState?.loading]);

  const rawValue =
    value && typeof value === "object"
      ? getBloodGroupLabel(value) ||
        String(
          value.blood_group_id ??
            value.blood_group_master_id ??
            value.bloodGroupId ??
            value.id ??
            value.value ??
            "",
        )
      : String(value ?? "").trim();

  const matchedItem = masterData.find((item) => {
    const normalizedValue = rawValue.toLowerCase();
    return (
      getBloodGroupIdentifiers(item).some(
        (identifier) => identifier === rawValue,
      ) ||
      getBloodGroupLabel(item).toLowerCase() === normalizedValue
    );
  });

  return matchedItem ? getBloodGroupLabel(matchedItem) || rawValue : rawValue;
}
