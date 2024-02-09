import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../sales.service';
import { VehicleType } from '../../models/vehicle-type';
import { VehicleTypeComponent } from '../vehicle-type/vehicle-type.component';
import { Vehicle } from '../../models/vehicle';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  constructor(private fb: FormBuilder, private salesService: SalesService, private dialog: MatDialog,private _snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<VehicleComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.vehicletypeSub?.unsubscribe();
    this.vehicleub?.unsubscribe();
    this.submit?.unsubscribe();
  }

  vehicleForm = this.fb.group({
    registrationNumber : ['', Validators.required],
    vehicleTypeId : ['', Validators.required],
    taxExpiry : ['', Validators.required],
    insuranceExpiry : ['', Validators.required],
    polutionExpiry : ['', Validators.required],
    capacity : ['', Validators.required],
    fitnessExpiry : ['', Validators.required],
    permitExpiry : ['', Validators.required]
  });

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    this.getVehicleType()
    this.getVehicle()
    this.getComplete();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true;
        this.patchData()
      }
    }
  }

  vehicletypeSub!: Subscription;
  vehicletypes: VehicleType[] = [];
  getVehicleType(value?: string){
    this.vehicletypeSub = this.salesService.getVehicleType().subscribe(vehicletype => {
      console.log(vehicletype);
      this.vehicletypes = vehicletype
      this.filteredVehicleType = vehicletype
      if(value){
        this.filterVehicleType(value);
      }
    })
  }

  filteredVehicleType: VehicleType[] = [];
  filterVehicleType(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredVehicleType = this.vehicletypes.filter((option) => {
      if (
        (option.typeName &&
          option.typeName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addVehicleType(){
    const dialogRef = this.dialog.open(VehicleTypeComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVehicleType(result?.type);
    });
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.vehicleForm.valid){
      return alert("Please fill the form correctly")
    }
    this.submit = this.salesService.addVehicle(this.vehicleForm.getRawValue()).subscribe(vehicle => {
      this._snackBar.open("Vehicle Details added successfully...","" ,{duration:3000})
      let data = {
        vehicle: this.vehicleForm.get('registrationNumber')?.value
      }
      this.dialogRef?.close(data);
      this.clearControls();
    },(error=>{
          alert(error.message)
    }))
  }

  clearControls(){
    this.getVehicle()
    this.vehicleForm.reset()
  }

  vehicle: Vehicle[] = [];
  vehicleub!: Subscription;
  getVehicle(){
    this.vehicleub = this.salesService.getPaginatedVehicle(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any)=>{
      this.filtered = res.items
      console.log(this.filtered);

      this.totalItems = res.count;
    })
  }

  detailSub!: Subscription;
  getComplete(){
    this.detailSub = this.salesService.getVehicle().subscribe((res:any)=>{
      this.vehicle = res;
      console.log(this.vehicle);
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getVehicle();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.vehicle.filter(element =>
        element.registrationNumber.toLowerCase().toString().includes(filterValue)
        || element.vehicleType.typeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
        || element.status.toString().includes(filterValue)
      );
    }
  }

  isEdit: boolean = false;
  editDetails(id: number){
    const dialogRef = this.dialog.open(VehicleComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVehicle();
    });
  }

  vehicleId!: number;
  patchData(){
    this.salesService.getVehicleById(this.dialogData?.id).subscribe(res=>{
      this.editstatus = true
      let vehicle = res
      console.log(vehicle)

      let registration = vehicle.registrationNumber
      let vehicleType: any = vehicle.vehicleTypeId
      let taxExpiry: any = vehicle.taxExpiry
      let polutionExpiry: any = vehicle.polutionExpiry
      let insuranceExpiry: any = vehicle.insuranceExpiry
      let fitnessExpiry: any = vehicle.fitnessExpiry
      let permitExpiry: any = vehicle.permitExpiry
      let capacity = vehicle.capacity

      this.vehicleForm.patchValue({
        registrationNumber : registration,
        vehicleTypeId : vehicleType,
        taxExpiry : taxExpiry,
        polutionExpiry : polutionExpiry,
        insuranceExpiry : insuranceExpiry,
        permitExpiry : permitExpiry,
        fitnessExpiry : fitnessExpiry,
        capacity : capacity
      })

      this.vehicleId = this.dialogData?.id;
    })
  }

  editFunction(){
    if(!this.vehicleForm.valid){
      alert("Please fill the form correctly")
    }
    let data = {
      registraionNumber : this.vehicleForm.get('registraionNumber')?.value,
      vehicleTypeId : this.vehicleForm.get('vehicleTypeId')?.value,
      taxExpiry : this.vehicleForm.get('taxExpiry')?.value,
      permitExpiry : this.vehicleForm.get('permitExpiry')?.value,
      polutionExpiry : this.vehicleForm.get('polutionExpiry')?.value,
      fitnessExpiry : this.vehicleForm.get('fitnessExpiry')?.value,
      insuranceExpiry : this.vehicleForm.get('insuranceExpiry')?.value,
      capacity : this.vehicleForm.get('capacity')?.value,
    }
    this.salesService.updateVehicle(this.vehicleId, data).subscribe(data=>{
      this._snackBar.open("Vehicle Details updated successfully...","" ,{duration:3000})
      this.dialogRef?.close();
      this.clearControls();
    },(error=>{
          alert(error.message)
    }))
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  delete!: Subscription;
  deleteDetails(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.salesService.deleteVehicle(id).subscribe((res)=>{
          this.getVehicle()
          this._snackBar.open("Vehicle deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.salesService.updateVehicleStatus(id, data).subscribe(data=>{
      this._snackBar.open("Status updated successfully...","" ,{duration:3000})
    });
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getVehicle();
  }
}
