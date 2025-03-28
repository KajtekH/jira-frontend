import {ChangeDetectionStrategy, Component, Input, input} from '@angular/core';
import { AvatarComponent, ButtonComponent, TextComponent } from '@fundamental-ngx/core';
import { CardModule } from '@fundamental-ngx/core/card';
import {TaskInterface} from "../../models/task/task.interface";
import {CdkDrag} from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [AvatarComponent, ButtonComponent, TextComponent, CardModule, CdkDrag],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  @Input() task: TaskInterface | undefined;

  protected getTypeIcon(): string {
    if (this.task?.type === 'BUG') {
      return 'wrench';
    } else if (this.task?.type === 'FEATURE') {
      return 'lead';
    } else if (this.task?.type === 'IMPROVEMENT') {
      return 'trend-up';
    } else if (this.task?.type === 'QUALITY') {
      return 'ai';
    }
    else {
      return '';
    }
  }
}
