back to [[配置笔记目录]]；

---
title: "URDF导出改ROS2包"
excerpt: "记录URDF导出改ROS2包的过程"
author: "Wang Eden"
date: "2025-12-28"
tags: ["机器人", "机械臂", "建模"]
category: "机器人"
cover: "/imgs/articleCover/机械臂.jpg"
views: 2
featured: false
slug: "urdf2ros2"
readTime: "10分钟"

---

### 在ros2中检查：

根据步骤来：

###### 0.安装ros2，使用鱼香ROS一键安装

```bash
wget http://fishros.com/install -O fishros && . fishros
```

###### 1.创建ros2工作空间：

创建目录：
```bash
mkdir ~/ros2_ws_robotarm # 创建工作空间，名字随意
mkdir -p ros2_ws_robotarm/src
```

编译初始化一下：
```bash
cd ~/ros2_ws_robotarm
colcon build
```

这样就会在这个工作空间下自动生成`build`、`install`、`log`等文件夹；

###### 2.移植SolidWorks的导出的ros包并修改相关配置

将SolidWorks的导出的ros包移动到`src`文件夹下，即如下目录结构：

```bash
├── ros2_ws_robotarm
│   ├── build
│   ├── install
│   ├── log
│   └── src
│       └── robotarm
```

因为SolidWorks导出的默认是ros1的包，因此在ros2环境下，需要修改一些配置
分别需要修改`CMakeLists.txt`、`package.xml`两个文件，以及在`launch`目录下，将`.launch`文件都改成`.launch.py`文件，然后创建`rviz/urdf.rviz`，下面进行详细说明：
（1）修改`CMakeLists.txt`为以下内容，其中第2行改为自己的包名：
```CMake
cmake_minimum_required(VERSION 3.5)
project(robotarm)
if(NOT CMAKE_C_STANDARD)
  set(CMAKE_C_STANDARD 99)
endif()

if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 14)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake REQUIRED)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()
endif()

install(DIRECTORY
  meshes urdf textures config launch rviz
  DESTINATION share/${PROJECT_NAME}/
)
ament_package()
```

（2）修改`package.xml`文件，同样，其中第3行根据自己包名修改：
```xml
<?xml version="1.0"?>
<package format="3">
  <name>robotarm</name>
  <version>0.1.0</version>
  <description>wangeden's robot arm description package</description>
  <maintainer email="wangedenx@outlook.com">cxy</maintainer>
  <license>BSD</license>
  <buildtool_depend>ament_cmake</buildtool_depend>
  <test_depend>ament_lint_auto</test_depend>
  <test_depend>ament_lint_common</test_depend>
  <exec_depend>joint_state_publisher</exec_depend>
  <exec_depend>joint_state_publisher_gui</exec_depend>
  <exec_depend>robot_state_publisher</exec_depend>
  <exec_depend>rviz2</exec_depend>
  <exec_depend>xacro</exec_depend>
  <export>
    <build_type>ament_cmake</build_type>
  </export>
</package>
```

（3）将`launch`目录下的`display.launch`和`gezebo.launch`修改为`display.launch.py`和`gezebo.launch.py`，然后修改内容：

`display.launch.py`修改为如下内容，第11行改为自己包名，第37行改为自己的urdf文件名；
```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, ExecuteProcess, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PythonExpression
from launch_ros.actions import Node
def generate_launch_description():
    # Get the launch directory
    bringup_dir = get_package_share_directory('robotarm')
    launch_dir = os.path.join(bringup_dir, 'launch')
    # Launch configuration variables specific to simulation
    rviz_config_file = LaunchConfiguration('rviz_config_file')
    use_robot_state_pub = LaunchConfiguration('use_robot_state_pub')
    use_joint_state_pub = LaunchConfiguration('use_joint_state_pub')
    use_rviz = LaunchConfiguration('use_rviz')
    urdf_file= LaunchConfiguration('urdf_file')
    declare_rviz_config_file_cmd = DeclareLaunchArgument(
        'rviz_config_file',
        default_value=os.path.join(bringup_dir, 'rviz', 'urdf.rviz'),
        description='Full path to the RVIZ config file to use')  
    declare_use_robot_state_pub_cmd = DeclareLaunchArgument(
        'use_robot_state_pub',
        default_value='True',
        description='Whether to start the robot state publisher')
    declare_use_joint_state_pub_cmd = DeclareLaunchArgument(
        'use_joint_state_pub',
        default_value='True',
        description='Whether to start the joint state publisher')
    declare_use_rviz_cmd = DeclareLaunchArgument(
        'use_rviz',
        default_value='True',
        description='Whether to start RVIZ')
    declare_urdf_cmd = DeclareLaunchArgument(
        'urdf_file',
        default_value=os.path.join(bringup_dir, 'urdf', 'robotarm.urdf'),
        description='Whether to start RVIZ')
    start_robot_state_publisher_cmd = Node(
        condition=IfCondition(use_robot_state_pub),
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        #parameters=[{'use_sim_time': use_sim_time}],
        arguments=[urdf_file])
    start_joint_state_publisher_cmd = Node(
        condition=IfCondition(use_joint_state_pub),
        package='joint_state_publisher_gui',
        executable='joint_state_publisher_gui',
        name='joint_state_publisher_gui',
        output='screen',
        arguments=[urdf_file])
    rviz_cmd = Node(
        condition=IfCondition(use_rviz),
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config_file],
        output='screen')
    # Create the launch description and populate
    ld = LaunchDescription()
    # Declare the launch options
    ld.add_action(declare_rviz_config_file_cmd)
    ld.add_action(declare_urdf_cmd)
    ld.add_action(declare_use_robot_state_pub_cmd)
    ld.add_action(declare_use_joint_state_pub_cmd)
    ld.add_action(declare_use_rviz_cmd)
    # Add any conditioned actions
    ld.add_action(start_joint_state_publisher_cmd)
    ld.add_action(start_robot_state_publisher_cmd)
    ld.add_action(rviz_cmd)
    return ld
```

`gezebo.launch.py`修改为如下内容，第10行改为自己包名，第21行改为自己的urdf文件名；
```python
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
import os
 
def generate_launch_description():
    # 获取当前包路径
    robot_package_dir = get_package_share_directory('robotarm')
 
    # 启动 Gazebo 空世界
    gazebo_ros_package_dir = get_package_share_directory('gazebo_ros')
    empty_world_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(gazebo_ros_package_dir, 'launch', 'empty_world.launch.py')
        )
    )
 
    # 加载 URDF 文件路径（需要提前用 xacro 生成）
    urdf_file_path = os.path.join(robot_package_dir, 'urdf', 'robotarm.urdf')
 
    # 启动 Gazebo 模型生成器节点
    spawn_entity_node = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        name='spawn_model',
        arguments=[
            '-entity', 'robot',
            '-file', urdf_file_path,
            '-topic', 'robot_description'
        ],
        output='screen'
    )
 
    # 静态 TF 发布器：base_link -> base_footprint
    tf_footprint_base_node = Node(
        package='tf2_ros',
        executable='static_transform_publisher',
        name='tf_footprint_base',
        arguments=['0', '0', '0', '0', '0', '0', 'base_link', 'base_footprint']
    )
 
    return LaunchDescription([
        empty_world_launch,
        spawn_entity_node,
        tf_footprint_base_node
    ])
```

（4）创建`rviz/urdf.rviz`，并填写一下内容：
```rviz
Panels:
  - Class: rviz_common/Displays
    Name: Displays
  - Class: rviz_common/Views
    Name: Views
Visualization Manager:
  Class: ""
  Displays:
    - Class: rviz_default_plugins/Grid
      Name: Grid
      Value: true
    - Alpha: 0.8
      Class: rviz_default_plugins/RobotModel
      Description Source: Topic
      Description Topic:
        Value: /robot_description
      Enabled: true
      Name: RobotModel
      Value: true
    - Class: rviz_default_plugins/TF
      Name: TF
      Value: true
  Global Options:
    Fixed Frame: base_link
    Frame Rate: 30
  Name: root
  Tools:
    - Class: rviz_default_plugins/MoveCamera
  Value: true
  Views:
    Current:
      Class: rviz_default_plugins/Orbit
      Distance: 1.7
      Name: Current View
      Pitch: 0.33
      Value: Orbit (rviz)
      Yaw: 5.5
Window Geometry:
  Height: 800
  Width: 1200
```
###### 3.编译运行

然后会到工作空间目录，重新进行编译：
```bash
cd ~/ros2_ws_robotarm
colcon build
```

source一下环境，然后就能运行了：
```bash
source /opt/ros/humble/setup.bash
source ~/ros2_ws_robotarm/install/setup.bash
ros2 launch robotarm display.launch.py
```

效果如下：

![[Pasted image 20251221005251.png]]

