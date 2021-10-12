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
  let rosbagReplay = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/play",
    messageType: "std_msgs/String",
  });
  let rosbagSave = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/record",
    messageType: "std_msgs/String",
  });
  let escSpeed = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/esc/speed",
    messageType: "std_msgs/String",
  });
  let escAngle = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/esc/angle",
    messageType: "std_msgs/String",
  });

  let escTimestamp = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/esc/timestamp",
    messageType: "std_msgs/String",
  });

  let escStatus = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/esc/status",
    messageType: "std_msgs/String",
  });

  let log = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/log",
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
    escSpeed,
    escAngle,

    escTimestamp,
    escStatus,
    rosbagReplay,
    rosbagSave,
    log,
  };
};
