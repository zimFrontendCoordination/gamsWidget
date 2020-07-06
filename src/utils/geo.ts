

/**
   * Reads out the navigator.geolocation object and returns the Client's position.
   * @returns {Promise<Position>} Client's position.
   */
  export const calcUserLoc = async (): Promise<Position> => {
    let getPos = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };
    let userLoc = (await getPos()) as Promise<Position>;
    return userLoc;
  };