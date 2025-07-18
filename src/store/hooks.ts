// // src/store/hooks.ts
// import {  useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
// import type { RootState, AppDispatch } from "./index";
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// store/hooks.ts
import { 
    useDispatch, 
    useSelector, 
    type TypedUseSelectorHook 
  } from "react-redux";
  import type { RootState, AppDispatch } from "./index";
  
  export const useAppDispatch = () => useDispatch<AppDispatch>();
  export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;