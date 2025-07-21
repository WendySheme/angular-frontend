import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  status: 'active' | 'inactive';
  attendanceRate: number;
  studentId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentList implements OnInit {
  students: Student[] = [];
  totalStudents: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  private loadStudents(): void {
    // Mock data - replace with actual service call
    this.students = [
      {
        id: '1',
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        class: '3A',
        status: 'active',
        attendanceRate: 95,
        studentId: 'STU001',
        isActive: true
      },
      {
        id: '2',
        name: 'Giulia Bianchi',
        email: 'giulia.bianchi@example.com',
        class: '3B',
        status: 'active',
        attendanceRate: 88,
        studentId: 'STU002',
        isActive: true
      }
    ];
    this.totalStudents = 25;
    this.totalPages = Math.ceil(this.totalStudents / this.pageSize);
  }

  ngOnInit(): void {
    this.loadStudents();
  }
}
