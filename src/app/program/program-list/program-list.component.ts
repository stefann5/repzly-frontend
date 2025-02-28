import { Component, OnInit } from '@angular/core';
import { ProgramOverviewDTO } from '../program-overview-dto';
import { ProgramService } from '../program-service/program.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgramCardComponent } from "../program-card/program-card.component";
import { AddProgramCardComponent } from "../add-program-card/add-program-card.component";
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [
    ToolbarModule, 
    ButtonModule, 
    ProgressSpinnerModule, 
    ProgramCardComponent,
    AddProgramCardComponent,
    CommonModule,
    PaginatorModule
  ],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.css'
})
export class ProgramListComponent implements OnInit {
  programs: ProgramOverviewDTO[] = [];
  loading: boolean = true;
  public first: number = 0;
  public rows: number = 3;
  public page: number = 0;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  
  constructor(private programService: ProgramService) {}
  
  ngOnInit() {
    this.loadPrograms(this.page, this.rows);
  }
  
  loadPrograms(page: number, size: number) {
    this.loading = true;
    this.programService.getPrograms(size, page).subscribe({
      next: (response) => {
        this.programs = response.content;
        this.totalRecords = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page;
    
    // Load data from server with new pagination parameters
    this.loadPrograms(this.page, this.rows);
  }
}