import { MatDialogConfig } from "@angular/material/dialog";

export function dialogConfig(data: any, width: string, height: string): MatDialogConfig {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  dialogConfig.width = width;
  dialogConfig.height = height;
  dialogConfig.data = data;
  return dialogConfig;
}
