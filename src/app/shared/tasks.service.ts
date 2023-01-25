import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import * as moment from "moment";

export interface Task {
  title: string,
  id?: string,
  date?: string
}

export interface CreateResponse {
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url = ' https://organizer-cd811-default-rtdb.europe-west1.firebasedatabase.app/tasks'

  constructor(private http: HttpClient) {
  }

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(
        map(res => {
          return {
            ...task,
            id: res.name
          }
        }))
  }

  getAllById(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
          if (!tasks) {
            return []
          }

          return Object.keys(tasks).map(key => ({
            // @ts-ignore
            ...tasks[key], id: key
          }))
        })
      )
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }

}
