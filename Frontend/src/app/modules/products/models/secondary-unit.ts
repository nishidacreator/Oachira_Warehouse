import { PrimaryUnit } from "./primary-unit";

export interface SecondaryUnit {
  id: number;
  secondaryUnitName : string;
  primaryUnitId : number;
  primaryFactor : number;
  secondaryFactor : number;
  loadingCharge : number;
  primaryUnit: PrimaryUnit
}
