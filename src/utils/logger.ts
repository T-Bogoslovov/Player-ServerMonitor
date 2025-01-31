export const logger = {
  debug: (message: string, data?: any) => {
    console.debug(
      `%c[Debug] ${message}`, 
      'color: #8B5CF6; font-weight: bold;',
      data ? '\n' + JSON.stringify(data, null, 2) : ''
    );
  },
  error: (message: string, error?: any) => {
    console.error(
      `%c[Error] ${message}`,
      'color: #EF4444; font-weight: bold;',
      error ? '\n' + JSON.stringify(error, null, 2) : ''
    );
  }
};