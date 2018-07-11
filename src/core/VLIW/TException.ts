
export class Exception {

  /*
  // Definici�n de valores de error
  typedef enum { , , } TVLIWStatus;
  typedef enum {VLIW_ERRRAW = -4, VLIW_ERRHARD = -3, VLIW_ERRBRANCHDEP = -2, VLIW_ERRPRED = -1, VLIW_ERRNO = 0} TVLIWError;
  */
  private _status: number;
  private _error: number;
  const static VLIW_PCOUTOFRANGE = -3;
  const static VLIW_ENDEXE = -2;
  const static VLIW_BREAKPOINT = -1;
  const static VLIW_OK = 0;

}
