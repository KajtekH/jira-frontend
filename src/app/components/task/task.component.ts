import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent, ButtonComponent, TextComponent } from '@fundamental-ngx/core';
import { CardModule } from '@fundamental-ngx/core/card';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [AvatarComponent, ButtonComponent, TextComponent, CardModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

}
