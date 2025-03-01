import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../service/employee.service';
import { Employee } from '../../../model/Employee';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  employeeForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    // Determinar si es edición o nuevo
    this.isEditMode = !!data.id;

    this.employeeForm = this.fb.group({
      id: [data.id || null], // Si es nuevo, id será null
      name: [data.name || '', Validators.required],
      lastname: [data.lastname || '', Validators.required],
      documentType: [data.documentType || '', Validators.required],
      documentNumber: [data.documentNumber || '', Validators.required],
      registrationDate: [data.registrationDate || new Date(), Validators.required],
      cellphone: [data.cellphone || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]]
    });
  }

  save(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      // Asegurar que el estado siempre sea 'A' al crear y al editar
      employeeData.status = 'A';

      if (this.isEditMode) {
        this.employeeService.editEmployee(employeeData.id, employeeData).subscribe(() => {
          this.dialogRef.close(employeeData);
        });
      } else {
        delete employeeData.id; // Se elimina para que la BD maneje el autoincremento
        this.employeeService.createEmployee(employeeData).subscribe(newEmployee => {
          this.dialogRef.close(newEmployee);
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
