import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/Employee';
import { ModalComponent } from './modal/modal.component'; // Importa el Modal
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastname', 'documentType', 'documentNumber', 'registrationDate', 'cellphone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  allEmployees: Employee[] = [];
  statusFilter: string = 'A'; // Estado inicial: Activos

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {} // Inyecta MatDialog

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.allEmployees = data;
      this.filterByStatus();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  filterByStatus() {
    this.dataSource.data = this.allEmployees.filter(emp => emp.status === this.statusFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {} // No se envía ningún dato para que el modal se abra vacío
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire('¡Agregado!', 'El empleado ha sido agregado con éxito.', 'success');
        this.loadEmployees(); // Recargar lista después de agregar
      }
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: employee // Pasamos el empleado a editar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire('¡Editado!', 'El empleado ha sido actualizado con éxito.', 'success');
        this.loadEmployees(); // Recargar lista después de editar
      }
    });
  }

  softDeleteEmployee(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este empleado será desactivado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.softDeleteEmployee(id).subscribe(() => {
          Swal.fire('¡Desactivado!', 'El empleado ha sido desactivado.', 'success');
          this.loadEmployees();
        });
      }
    });
  }

  restoreEmployee(id: number) {
    Swal.fire({
      title: '¿Restaurar empleado?',
      text: 'Este empleado volverá a estar activo',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, restaurar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.restoreEmployee(id).subscribe(() => {
          Swal.fire('¡Restaurado!', 'El empleado ha sido restaurado.', 'success');
          this.loadEmployees();
        });
      }
    });
  }
}
