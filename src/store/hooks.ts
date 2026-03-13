import { useDispatch, useSelector } from "react-redux";
import type { GlobalState } from "../interface/reducers";
import type { store } from "../store";

/** Typed version of `useSelector` bound to the application's root state shape. */
export const useAppSelector = useSelector.withTypes<GlobalState>();

/** Typed version of `useDispatch` bound to the application's store dispatch type. */
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
