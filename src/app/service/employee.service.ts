import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'https://scaling-invention-wr7v6qj55vwr2576x-8085.app.github.dev/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getActiveEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/active`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  editEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  restoreEmployee(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/restore/${id}`, {});
  }

  softDeleteEmployee(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/delete/${id}`, {});
  }
}
