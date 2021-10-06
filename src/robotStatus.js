class RobotStatus {
  robotID = "NO_ID";
  battery = 100;
  position = {
    x: 0,
    y: 0,
    z: 0,
  };
  attitude = {
    x: 0,
    y: 0,
    z: 0,
  };
  constructor(robotID, battery, position = { x: 0, y: 0, z: 0 }) {
    this.robotID = robotID;
    this.battery = battery;
    this.position = position;
  }
  //   setChassis({ x, y, z }) {
  //     this.chassis = { x, y, z };
  //   }
  publishBattery(elementID) {
    let htmlObject = document.getElementById(elementID);

    let batteryIcon = "full";
    if (this.battery > 75) batteryIcon = "full";
    else if (this.battery > 50) batteryIcon = "three-quarters";
    else if (this.battery > 25) batteryIcon = "half";
    else if (this.battery > 0) batteryIcon = "quarter";
    htmlObject.innerHTML = `<span id="battery-data" class="text-success me-1">${this.battery}%</span><i class="text-success fas fa-battery-${batteryIcon} fa-lg"></i>`;
  }

  publishRobotID(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `${this.robotID}`;
  }
  publishChassis(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `X:${this.chassis.x} Y:${this.chassis.y} Z:${this.chassis.z}`;
  }
}

export default RobotStatus;
