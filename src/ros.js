class RoboController {
  positionX = 0;
  positionAngularX = 0;
  gimbalX = 0;
  gimbalAngularX = 0;
  stopFlag = false;
  constructor(positionX, positionAngularX, gimbalX, gimbalAngularX) {
    this.positionX = positionX;
    this.positionAngularX = positionAngularX;
    this.gimbalX = gimbalX;
    this.gimbalAngularX = gimbalAngularX;
  }
  setPositionX = (x) => {
    this.positionX = x;
  };
  setAngularX = (x) => {
    this.positionAngularX = x;
  };
  setGimbal = (x) => {
    this.gimbalX = x;
  };
  setGimbalAngular = (x) => {
    this.gimbalAngularX = x;
  };
  publishPosition = (rostopic) => {
    let positionData = new ROSLIB.Message({
      linear: {
        x: this.positionX,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: this.positionAngularX * -100,
        y: 0.0,
        z: 0.0,
      },
    });
    rostopic.publish(positionData);
  };
  publishGimbal = (rostopic) => {
    let gimbalData = new ROSLIB.Message({
      linear: {
        x: this.gimbalAngularX * 100,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: this.gimbalX * 100,
        y: 0.0,
        z: 0.0,
      },
    });
    rostopic.publish(gimbalData);
  };
  shot = (rostopic) => {
    let message = new ROSLIB.Message("1");
  };
  stopMove = (rostopic) => {
    this.positionX = 0;
    this.positionAngularX = 0;
    this.gimbalX = 0;
    this.gimbalAngularX = 0;
    this.stopFlag = false;
    let empty = new ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    });
    rostopic.publish(empty);
  };
}

export default RoboController;
