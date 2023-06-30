declare module 'vue-ellipse-progress' {
  // import { defineComponent } from 'vue';
  import Vue from 'vue';
  export class VueEllipseProgress extends Vue {
    progress: number;
    size: number | null;
    line: 'round' | 'square' | 'butt';
    thickness: number | string | null;
    lineMode:
      | `${
          | 'normal'
          | 'out'
          | 'out-over'
          | 'in'
          | 'in-over'
          | 'top'
          | 'bottom'} ${number}`
      | null;
    emptyThickness: number | string | null;
    color: string | Record<any, any> | null;
    colorFill: string | Record<any, any> | null;
    emptyColor: string | Record<any, any> | null;
    emptyColorFill: string | Record<any, any> | null;
    legend: boolean | null;
  }
}
