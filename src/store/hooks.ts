import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";

/** Typed version of `useSelector` bound to the application's root state shape. */
export const useAppSelector = useSelector.withTypes<RootState>();

/** Typed version of `useDispatch` bound to the application's store dispatch type. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
