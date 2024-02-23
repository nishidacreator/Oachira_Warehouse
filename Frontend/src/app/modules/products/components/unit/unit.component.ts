import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PrimaryUnit } from '../../models/primary-unit';
import { SecondaryUnit } from '../../models/secondary-unit';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  addStatus!: string | null;
  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<UnitComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.pUnitSubscription?.unsubscribe();
    this.sUnitSubscription?.unsubscribe();
    this.pSubmit?.unsubscribe();
    this.pDelete?.unsubscribe();
    this.pEdit?.unsubscribe();
    this.sSubmit?.unsubscribe();
    this.sDelete?.unsubscribe();
    this.sEdit?.unsubscribe();
  }

  unitForm = this.fb.group({
    unitType: ['', Validators.required],
  })

  primaryUnitForm = this.fb.group({
    primaryUnitName: ['', Validators.required],
    factor: [0, Validators.required],
    secondaryUnits: this.fb.array([]),
  })

  secondaryUnitForm = this.fb.group({
    secondaryUnitName: ['', Validators.required],
    primaryFactor: ['', Validators.required],
    secondaryFactor: [''],
    primaryUnitId: [null, Validators.required],

    primaryUnit: [''],  // Add primaryUnit control
    loadingCharge: []
  });


  secondaryUnits(): FormArray {
    return this.primaryUnitForm.get("secondaryUnits") as FormArray;
  }

  newSecondaryUnit(): FormGroup {
    return this.fb.group({
      secondaryUnitName: ['', Validators.required],
      primaryFactor: [,Validators.required],
      secondaryFactor: [''],
      loadingCharge: []
    });
  }

  status: boolean = false;
  addSecondary() {
    this.status = true;
    this.secondaryUnits().push(this.newSecondaryUnit());
  }

  removeSecondary(i: number) {
    this.secondaryUnits().removeAt(i);
  }


  displayedColumns : String[] = ['id', 'primaryUnitName', 'value', 'manage']
  secondaryDisplayedColumns : String[] = ['id', 'secondaryUnitName', 'factor', 'primaryUnitId', 'manage']

  unitType : Boolean = false;
  // status : Boolean = true;

  ngOnInit(): void {
    this.getSecondaryUnits();
    this.getPrimaryUnits();
    this.setValue();
    // this.onSecondaryySubmit()
    if (this.dialogRef) {
      this.addStatus = 'true';

      if(this.dialogData?.status === 'add'){
        this.unitForm.get('unitType')?.setValue(this.dialogData?.unit);
      }
      if(this.dialogData.unit === 'primary' && this.dialogData?.status === 'true'){
        this.patchDataPrimary()
      }else if(this.dialogData.unit === 'secondary' && this.dialogData?.status === 'true'){
        this.patchDataSecondary()
      }

    }
  }

  setValue(){
    this.primaryUnitForm.get('factor')?.setValue(1)
  }

  pSubmit!: Subscription;
  onPrimarySubmit(){
    console.log(this.primaryUnitForm.getRawValue());
      this.pSubmit = this.productService.addPrimaryUnit(this.primaryUnitForm.getRawValue()).subscribe((res)=>{
        this._snackBar.open("Primary Unit added successfully...","" ,{duration:3000})
        let data = {
          unit: this.primaryUnitForm.get('primaryUnitName')?.value
        }
        this.dialogRef?.close(data);
        this.clearControls()
      },(error=>{
        alert(error)
      }))
  }

  sSubmit!: Subscription;
  onSecondarySubmit(){
    this.sSubmit = this.productService.addSecondaryUnit(this.secondaryUnitForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Secondary Unit added successfully...","" ,{duration:3000})
      let data = {
        unit: res
      }
      this.dialogRef?.close(data);
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.unitForm.reset()
    this.unitForm.setErrors(null)
    Object.keys(this.unitForm.controls).forEach(key=>{this.unitForm.get(key)?.setErrors(null)})

    this.primaryUnitForm.reset()
    this.primaryUnitForm.setErrors(null)
    Object.keys(this.primaryUnitForm.controls).forEach(key=>{this.primaryUnitForm.get(key)?.setErrors(null)})

    this.secondaryUnitForm.reset()
    this.secondaryUnitForm.setErrors(null)
    Object.keys(this.secondaryUnitForm.controls).forEach(key=>{this.secondaryUnitForm.get(key)?.setErrors(null)})
    this.getPrimaryUnits()
    this.getSecondaryUnits()

  }

  pUnits : PrimaryUnit[] = [];
  pUnitSubscription? : Subscription;
  getPrimaryUnits(){
    this.pUnitSubscription = this.productService.getPrimaryUnit().subscribe((res)=>{
      this.pUnits = res
      this.filtered = this.pUnits
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.pUnits.filter(element =>
      element.primaryUnitName.toLowerCase().includes(filterValue)
      || element.id.toString().includes(filterValue)
    );
  }

  sUnits : SecondaryUnit[] = [];
  sUnitSubscription? : Subscription;
  getSecondaryUnits(){
    this.sUnitSubscription = this.productService.getSecondaryUnit().subscribe((res)=>{
      this.sUnits = res
      this.secFiltered = this.sUnits
    })
  }

  secFilterValue: any;
  secFiltered!: any[];
  applySecFilter(event: Event): void {
    console.log(this.sUnits)
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.secFilterValue = filterValue;
    this.secFiltered = this.sUnits.filter(element =>
      element.secondaryUnitName.toLowerCase().includes(filterValue)
      || element.primaryUnit.primaryUnitName.toLowerCase().includes(filterValue)
      || element.id.toString().toLowerCase().includes(filterValue)
    );
  }

  pDelete!: Subscription;
  deletePUnit(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.pDelete = this.productService.deletePUnit(id).subscribe((res)=>{
          this.clearControls()
          this._snackBar.open("Primary Unit deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
}

sDelete!: Subscription;
deleteSUnit(id : any){
  const dialogRef = this.dialog.open(DeleteDialogueComponent, {
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.sDelete = this.productService.deleteSUnit(id).subscribe((res)=>{
        this.clearControls()
        this._snackBar.open("Secondary Unit deleted successfully...","" ,{duration:3000})
      },(error=>{
        this._snackBar.open(error.error.message,"" ,{duration:3000})
      }))
    }
  })
}

isEdit = false;
pUnitStatus = false;
pUnitId : any;
editPUnit(id : any){
  this.isEdit = true;
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "true" , type : "edit", id: id, unit: "primary"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPrimaryUnits();
    });
}

patchDataPrimary(){
  this.isEdit = true;
  this.pUnitStatus = true;
  this.pUnitSubscription = this.productService.getPrimaryUnit().subscribe((res)=>{
    this.pUnits = res
  //Get the product based on the ID
    let punit: any = this.pUnits.find(x =>x.id == this.dialogData.id)

    //Populate the object by the ID
    let primaryUnitName = punit.primaryUnitName.toString();
    let factor = punit.factor;

    this.unitForm.patchValue({
      unitType : 'primary'
    })

    this.primaryUnitForm.patchValue({
      primaryUnitName : primaryUnitName,
      factor : factor
    });
    this.pUnitId = this.dialogData.id;
  });
}

pEdit!: Subscription;
editPUnitFunction(){
  this.isEdit = false;
  this.pUnitStatus = false;
  let data: any ={
    primaryUnitName : this.primaryUnitForm.get('primaryUnitName')?.value,
    factor : this.primaryUnitForm.get('factor')?.value
  }
  this.pEdit = this.productService.updatePUnit(this.pUnitId, data).subscribe((res)=>{
    this._snackBar.open("Primary Unit updated successfully...","" ,{duration:3000})
    this.dialogRef.close();
    this.clearControls();
  },(error=>{
        alert(error.message)
      }))
  }

  sUnitId : any;
  editSUnit(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "true" , type : "edit", id: id, unit: "secondary"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSecondaryUnits();
    });
  }

  patchDataSecondary(){
    this.isEdit = true;
    //Get the product based on the ID
    this.sUnitSubscription = this.productService.getSecondaryUnit().subscribe((res)=>{
      this.sUnits = res
      let sunit: any = this.sUnits.find(x =>x.id == this.dialogData.id)

      //Populate the object by the ID
      let secondaryUnitName = sunit.secondaryUnitName.toString();
      let primaryUnitId = sunit.primaryUnitId
      let factor = sunit.primaryFactor;
      let secondaryFactor = sunit.secondaryFactor;
      let loadingCharge = sunit.loadingCharge

      this.unitForm.patchValue({
        unitType : 'secondary'
      })

      this.secondaryUnitForm.patchValue({
        secondaryUnitName : secondaryUnitName,
        primaryUnitId: primaryUnitId,
        primaryFactor : factor,
        secondaryFactor: secondaryFactor,
        loadingCharge: loadingCharge
      });

      this.sUnitId = this.dialogData.id;
    });
  }

  sEdit!: Subscription;
  editSUnitFunction(){
    this.isEdit = false;

    let data: any ={
      secondaryUnitName : this.secondaryUnitForm.get('secondaryUnitName')?.value,
      primaryUnitId : this.secondaryUnitForm.get('primaryUnitId')?.value,
      primaryFactor : this.secondaryUnitForm.get('primaryFactor')?.value,
      secondaryFactor : this.secondaryUnitForm.get('secondaryFactor')?.value,
      loadingCharge : this.secondaryUnitForm.get('loadingCharge')?.value
    }

    this.sEdit = this.productService.updateSUnit(this.sUnitId, data).subscribe((res)=>{
      this._snackBar.open("Secondary Unit updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
        alert(error.message)
        }))
    }
    onCancelClick(): void {
      this.dialogRef.close();
    }

    onToggleChange(event: any, id: number) {
      const newValue = event.checked;

      let data = {
        status : newValue
      }
      this.productService.updatePunitStatus(id, data).subscribe(data=>{
        console.log(data);
      });
    }

    onToggleChangeSecondary(event: any, id: number) {
      const newValue = event.checked;

      let data = {
        status : newValue
      }
      this.productService.updateSunitStatus(id, data).subscribe(data=>{
        console.log(data);
      });
    }


    // updateSecondaryUnitName() {
    //   const primaryUnitId = this.secondaryUnitForm.controls['primaryUnitId'].value;
    //   const primaryFactor = this.secondaryUnitForm.controls['primaryFactor'].value;
    //   const secondaryFactor = this.secondaryUnitForm.controls['secondaryFactor'].value;

    //   const selectedPrimaryUnit = this.pUnits.find(item => item.id === primaryUnitId);
    //   const primaryUnitName = selectedPrimaryUnit ? selectedPrimaryUnit.primaryUnitName : '';

    //   const concatenatedName = `${primaryFactor} * ${secondaryFactor} ${primaryUnitName}`;

    //   this.secondaryUnitForm.patchValue({
    //     secondaryUnitName: concatenatedName
    //   });
    // }

    // Assuming you have other functions like editSUnitFunction()

//     updateSecondaryUnitName() {
//       const primaryUnitId = this.secondaryUnitForm.controls['primaryUnitId'].value;
//       const primaryFactor = this.secondaryUnitForm.controls['primaryFactor'].value;
//       const secondaryFactor = this.secondaryUnitForm.controls['secondaryFactor'].value;

//       const selectedPrimaryUnit = this.pUnits.find(item => item.id === primaryUnitId);
//       const primaryUnitName = selectedPrimaryUnit ? selectedPrimaryUnit.primaryUnitName : '';

//       // Ensure primaryFactor and secondaryFactor are not null or undefined
//       if (primaryFactor != null && primaryFactor != undefined &&
//           secondaryFactor != null && secondaryFactor != undefined) {

//         // Check if both primaryFactor and secondaryFactor are valid numbers
//         const isValidNumber = !isNaN(+primaryFactor) && !isNaN(+secondaryFactor);

//         if (isValidNumber) {
//           const result = (+primaryFactor) * (+secondaryFactor);

//           let secondaryUnitName = '';

//           // Determine the secondary unit name based on the chosen primary unit
//        // Determine the secondary unit name based on the chosen primary unit
// // Determine the secondary unit name based on the chosen primary unit
// switch (primaryUnitName.toLowerCase()) {
//   case 'kg':
//     secondaryUnitName = `${result} KG  BAG`;
//     break;
//   case 'no':
//     secondaryUnitName = `${result} NO BOX`;
//     break;
//   case 'litre':
//     secondaryUnitName = `${result} LITRE TIN`;
//     break;
//   case 'nos':
//     secondaryUnitName = `${result} NOS BOX`;
//     break;

//   default:
//     console.error('Unhandled primary unit:', primaryUnitName);
//     break;
// }



//           // Use setValue to directly set the value of secondaryUnitName in the form
//           this.secondaryUnitForm.controls['secondaryUnitName'].setValue(secondaryUnitName.trim());
//         } else {
//           console.error('Invalid numeric values for primaryFactor or secondaryFactor');
//         }
//       } else {
//         console.error('primaryFactor or secondaryFactor is null or undefined');
//       }
//     }

updateSecondaryUnitName() {
  const primaryUnitId = this.secondaryUnitForm.controls['primaryUnitId'].value;
  const primaryFactor = this.secondaryUnitForm.controls['primaryFactor'].value;
  const secondaryFactor = this.secondaryUnitForm.controls['secondaryFactor'].value;

  const selectedPrimaryUnit = this.pUnits.find(item => item.id === primaryUnitId);
  const primaryUnitName = selectedPrimaryUnit ? selectedPrimaryUnit.primaryUnitName : '';

  // Ensure primaryFactor and secondaryFactor are not null or undefined
  if (
    primaryFactor !== null && primaryFactor !== undefined &&
    secondaryFactor !== null && secondaryFactor !== undefined
  ) {
    // Check if both primaryFactor and secondaryFactor are valid numbers
    const isValidNumber = !isNaN(+primaryFactor) && !isNaN(+secondaryFactor);

    if (isValidNumber) {
      // Check if both primaryFactor and secondaryFactor are 1, and handle accordingly
      if (+primaryFactor === 1 && +secondaryFactor === 1) {
        this.secondaryUnitForm.controls['secondaryUnitName'].setValue(primaryUnitName.toUpperCase());
      } else {
        const result = (+primaryFactor) * (+secondaryFactor);
        let secondaryUnitName = '';

        // Determine the secondary unit name based on the chosen primary unit
        switch (primaryUnitName.toLowerCase()) {
          case 'kg':
            secondaryUnitName = `${result} KG  BAG`;
            break;
          case 'no':
            secondaryUnitName = `${result} NO BOX`;
            break;
      
          case 'nos':
            secondaryUnitName = `${result} NOS BOX`;
            break;
          case 'litre':
            secondaryUnitName = `${result} LITRE TIN`;
            break;
          default:
            console.error('Unhandled primary unit:', primaryUnitName);
            break;
        }

        // Use setValue to directly set the value of secondaryUnitName in the form
        this.secondaryUnitForm.controls['secondaryUnitName'].setValue(secondaryUnitName.trim());
      }
    } else {
      console.error('Invalid numeric values for primaryFactor or secondaryFactor');
    }
  } else {
    console.error('primaryFactor or secondaryFactor is null or undefined');
  }
}







}
