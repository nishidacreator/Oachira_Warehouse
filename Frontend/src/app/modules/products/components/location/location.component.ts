import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Location } from '../../models/location';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  constructor(private fb: FormBuilder,public productService: ProductService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<LocationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.locationSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
  }

  locationForm = this.fb.group({
    locationName: ['', Validators.required],
    status : [false ,Validators.required],
  });

  displayedColumns : string[] = ['id','locationName', 'manage']

  addStatus!: string;
  editstatus!: boolean;
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;

      this.patchData()
    }
    this.locationForm.get('status')?.setValue(true);
    this.getLocation()
  }

  file!: any;
  url!: any;
  uploadStatus = false
  imageUrl!: string;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.uploadStatus= true
      this.file = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.file) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    if(!this.locationForm.valid){
      return alert('Please fill the form first')
    }
    this.submit = this.productService.addLocation(this.locationForm.getRawValue()).subscribe((response)=>{
      console.log(response);
      this._snackBar.open("Location added successfully...","" ,{duration:3000})
      this.clearControls()
      this.dialogRef?.close()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getLocation()
    this.locationForm.reset()
    this.locationForm.setErrors(null)
    Object.keys(this.locationForm.controls).forEach(key=>{this.locationForm.get(key)?.setErrors(null)})
    this.file = null;
    this.imageUrl = '';
  }

  locations: Location[] = [];
  locationSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getLocation(){
    this.locationSubscription = this.productService.getLocation().subscribe((res:any)=>{
      this.locations = res;
      this.filtered = this.locations
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.locations.filter(element =>
      element.locationName.toLowerCase().includes(filterValue)
      || element.id.toString().includes(filterValue)
      || element.status.toString().includes(filterValue)
    );
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getLocation();
    }
  }

  delete!: Subscription;
  deleteLocation(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.productService.deleteLocation(id).subscribe((res)=>{
          this.getLocation()
          this._snackBar.open("Location deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  locationId : any;
  editLocation(id : any){
    this.isEdit = true;
    const dialogRef = this.dialog.open(LocationComponent, {
      data: { status: "true" , type : "edit", id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getLocation();
    });
  }

  patchData(){
    this.productService.getLocation().subscribe(res=>{
      if(this.dialogData?.type === 'edit'){
        this.editstatus = true
        console.log(res)
        let location = res.find(x =>x.id == this.dialogData?.id)
        console.log(location)

        let locationName = location?.locationName;
        let status = location?.status;

        this.locationForm.patchValue({
          locationName : locationName,
          status : status,
        })
        this.locationId = this.dialogData?.id;
      }
    })
  }

  edit!:Subscription;
  editFunction(){
    if(!this.locationForm.valid){
      return alert('Please fill the form first')
    }
    let data={
      locationName  : this.locationForm.get('locationName')?.value,
      status : this.locationForm.get('status')?.value,
    }
    this.submit = this.productService.updateLocation(this.locationId, data).subscribe((res)=>{
      let data = {
        location: this.locationForm.get('locationName')?.value
      }
      this.dialogRef?.close(data);
      this._snackBar.open("Location updated successfully...","" ,{duration:3000})
      this.dialogRef.close();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  clearFileInput() {
    this.imageUrl = '';
  }

  onToggleChange(event: any, id: number) {
    const newValue = event.checked;

    let data = {
      status : newValue
    }
    this.productService.updateLocationStatus(id, data).subscribe(data=>{
      console.log(data);
    });
  }
}

