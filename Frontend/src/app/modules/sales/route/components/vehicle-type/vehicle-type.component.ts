import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SalesService } from '../../../sales.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VehicleType } from '../../models/vehicle-type';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private salesService: SalesService, private _snackBar: MatSnackBar, private dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<VehicleTypeComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
    this.vehicleSub?.unsubscribe();
    this.vehicleSubs?.unsubscribe();
    this.edit?.unsubscribe();
  }

  vehicleTypeForm = this.fb.group({
    typeName : ['', Validators.required]
  });

  addStatus = 'false';
  editStatus = false;
  ngOnInit(): void {
    this.getVehicleType();

    if(this.dialogRef){
      this.addStatus = this.dialogData?.status
      if(this.dialogData.type === 'edit'){
        this.editStatus = true;
        this.patchData()
      }
    }
  }

  submit!: Subscription;
  onSubmit(){
    if(!this.vehicleTypeForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.salesService.addVehicleType(this.vehicleTypeForm.getRawValue()).subscribe(vehicle => {
      this._snackBar.open("Vehicle Details added successfully...","" ,{duration:3000})
      let data = {
        type: this.vehicleTypeForm.get('typeName')?.value
      }
      this.dialogRef?.close(data);
      this.clearControls();
    },(error=>{
          alert(error.message)
    }))
  }

  clearControls(){
    this.getVehicleType()
    this.vehicleTypeForm.reset()
  }

  vehicleType: VehicleType[] = [];
  vehicleSub!: Subscription;
  getVehicleType(){
    this.vehicleSub = this.salesService.getVehicleType().subscribe(data=>{
      this.vehicleType = data
      this.filtered = this.vehicleType
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getVehicleType();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.vehicleType.filter(element =>
        element.typeName.toLowerCase().includes(filterValue)
        || element.id.toString().includes(filterValue)
      );
    }
  }

  editVehicleType(id: number){
    const dialogRef = this.dialog.open(VehicleTypeComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVehicleType();
    });
  }

  vehicleTypeId!: number;
  vehicleSubs!: Subscription;
  patchData(){
    this.vehicleSubs = this.salesService.getVehicleTypeById(this.dialogData?.id).subscribe(res=>{
      let vehicle = res
      console.log(vehicle)

      let type = vehicle.typeName.toString()

      this.vehicleTypeForm.patchValue({
        typeName : type
      })

      this.vehicleTypeId = this.dialogData?.id;
    })
  }

  edit!: Subscription;
  editFunction(){
    if(!this.vehicleTypeForm.valid){
      return alert('Please fill the form first')
    }
    let data = {
      typeName: this.vehicleTypeForm.get('typeName')?.value
    }
    this.edit = this.salesService.updateVehicleType(this.vehicleTypeId, data).subscribe(data=>{
      this._snackBar.open("Vehicle Type updated successfully...","" ,{duration:3000})
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
  deleteVehicleType(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.salesService.deleteVehicleType(id).subscribe(result=>{
          this._snackBar.open("Vehicle Type deleted successfully...","" ,{duration:3000})
          this.dialogRef?.close();
          this.clearControls();
        },(error=>{
              alert(error.message)
        }))
      }
    })
  }
}
