export const getTopics = (ros) => {
  let listener = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/image",
    messageType: "sensor_msgs/CompressedImage",
  });

  let chassis = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/chassis",
    messageType: "geometry_msgs/Twist",
  });

  let gimbal = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/gimbal",
    messageType: "geometry_msgs/Twist",
  });

  let position = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/position",
    messageType: "std_msgs/String",
  });

  let attitude = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/attitude",
    messageType: "std_msgs/String",
  });

  let imu = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/imu",
    messageType: "std_msgs/String",
  });
  let status = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/status",
    messageType: "std_msgs/String",
  });
  let battery = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/battery",
    messageType: "std_msgs/Float64",
  });

  let gimbalRead = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/gimbal_angle",
    messageType: "std_msgs/String",
  });

  return {
    listener,
    chassis,
    gimbal,
    position,
    attitude,
    imu,
    status,
    battery,
    gimbalRead,
  };
};
