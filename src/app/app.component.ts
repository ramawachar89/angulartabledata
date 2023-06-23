import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonService } from './commonservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Chart';
  data: any;
  dataamount: any[] = [];

  constructor(private _commonservice: CommonService) {}

  calculateTotalTime(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalMilliseconds = end.getTime() - start.getTime();
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
    return `${hours} hours ${minutes} minutes`;
  }

  calculateBackgroundColor(employee: any): string {
    const totalTime = this.calculateTotalTime(
      employee['StartTimeUtc'],
      employee['EndTimeUtc']
    );
    return parseInt(totalTime) < 100 ? 'rgb(255, 255, 0)' : 'rgb(0, 123, 255)';
  }

  ngOnInit() {
    this._commonservice.showdata().subscribe((data) => {
      this.data = data;
      if (this.data != null) {
        for (let i = 0; i < this.data.length; i++) {
          this.dataamount.push(this.data[i].amount);
        }
      }

      this.showchartdata();
    });
  }

  showchartdata() {
    const chartData = [];
    let totalTime = 0;

    for (let i = 0; i < this.data.length; i++) {
      const employee = this.data[i];
      const time = this.calculateTotalTime(
        employee['StarTimeUtc'],
        employee['EndTimeUtc']
      );

      totalTime += parseInt(time);
    }

    for (let i = 0; i < this.data.length; i++) {
      const employee = this.data[i];
      const time = this.calculateTotalTime(
        employee['StarTimeUtc'],
        employee['EndTimeUtc']
      );
      const percentage = ((parseInt(time) / totalTime) * 100).toFixed(2);

      chartData.push({
        label: employee['EmployeeName'],
        data: [percentage],
        backgroundColor: this.calculateBackgroundColor(employee),
      });
    }

    new Chart('myChart', {
      type: 'pie',
      data: {
        labels: chartData.map((data) => data.label),
        datasets: [
          {
            label: 'Percentage of Total Time Worked',
            data: chartData.map((data) => data.data[0]),
            backgroundColor: [
              'rgb(255, 99, 132)',   // Color 1
              'rgb(54, 162, 235)',   // Color 2
              'rgb(255, 205, 86)',   // Color 3
              'rgb(75, 192, 192)',   // Color 4
              'rgb(153, 102, 255)',  // Color 5
              'rgb(255, 159, 64)',   // Color 6
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
