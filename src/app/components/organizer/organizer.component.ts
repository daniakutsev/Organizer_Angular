import {Component, OnInit} from '@angular/core';
import {DateService} from "../../shared/date.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TasksService} from "../../shared/tasks.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  // @ts-ignore
  form: FormGroup
  tasks: Task[] = []

  constructor(public dateService: DateService,
              private tasksService: TasksService
  ) {
  }

  ngOnInit(): void {

    this.dateService.date.pipe(
      switchMap(value => this.tasksService.getAllById(value))
    ).subscribe(tasks => {

      this.tasks = tasks
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    })
  }

  submit() {
    const {title} = this.form.value
    const task: Task = {
      // @ts-ignore
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    // @ts-ignore
    this.tasksService.create(task).subscribe(task => {
      console.log('New task:', task)
      this.tasks.push(task)
      this.form.reset()
    }, err => console.error(err))
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id)
    }, err => console.error(err))
  }
}
