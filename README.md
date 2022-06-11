[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/POWERARE/PsycareProject">
    <img src="Image/1652338802082.jpg" alt="Logo" width="300" height="80">
  </a>


  <p align="center">
    (Application to detect Depression,anxiety, and stress based on Dass42 and connect people with psychologist) 
    <br />
    <a href="https://github.com/POWERARE/PsycareProject"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/POWERARE/PsycareProject">View Demo</a>
    ·
    <a href="https://github.com/POWERARE/PsycareProject/issues">Report Bug</a>
    ·
    <a href="https://github.com/POWERARE/PsycareProject/issues">Request Feature</a>
    <br />
     <a href="https://github.com/POWERARE/PsycareProject">
    <img src="Image/Untitled-2.gif" alt="Logo" width="200" height="450"> </a>
  </p>
</div>

# Backgrounder
<p align="justify">
Covid-19 Pandemic is one of the worst pandemic outbreaks in the last 100 years. This causes major problems in many sectors in every country and leads to a total lockdown. This has caused people to lose their jobs all over the world. Besides, there are risks for people to get sick from Covid-19 virus. This situation has led to many people having stress and mental health problems. 
Therefore, our team decided to make an application to help people determine their stress severity and give them suggestions to overcome their problems. This app will also be able to connect people to a psychologist so they’ll be able to share their burden and find a solution.
</p>

# Application Creation Flowchart
<div align="center">
  <a href="https://github.com/POWERARE/PsycareProject">
    <img src="Image/Untitled Diagram.drawio (1).png" alt="Logo" width="900" height="350">
  </a>

# API Endpoint
|     Endpoint                         |   Method      | Body Sent (JSON) |              Description                       |
|:-----------------------------------: | :-----------: | :--------------: | :--------------------------------------------: |
| /api                                 |     GET       |       None       |   HTTP GET REQUEST Testing Endpoint            |
| /api/users                           |    POST       |     Anything     |   HTTP POST REQUEST Testing Endpoint           |
| /api/users/:userId                   | PUT & GET     |     Anything     |   HTTP PUT & GET REQUEST Testing  endpoint     |
| /api/users/fav/:userId               | POST & DELETE |     Anything     |   HTTP POST & DELETE REQUEST  Endpoint         |
| /api/users/histories/:userId         | GET           |     Anything     |   HTTP GET REQUEST Testing Endpoint            |
| /api/discussions                     | POST & GET    |     Anything     |   HTTP POST & GET REQUEST Testing Endpoint     |
| /api/discussions/reply/:discussionId | POST & GET    |     Anything     |   HTTP POST & GET REQUEST Testing Endpoint     |
| /api/psikolog                        | GET           |     Anything     |   HTTP GET REQUEST Testing Endpoint            |
| /api/predict/:userId                 | POST          |     Anything     |   HTTP POST REQUEST Testing Endpoint           |
| /api/discussions                     | POST & GET    |     Anything     |   HTTP POST & GET REQUEST Testing Endpoint     |
  
  
  
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/POWERARE/PsycareProject.svg?style=for-the-badge
[contributors-url]: https://github.com/POWERARE/PsycareProject/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/POWERARE/PsycareProject.svg?style=for-the-badge
[forks-url]: https://github.com/POWERARE/PsycareProject/network/members
[stars-shield]: https://img.shields.io/github/stars/POWERARE/PsycareProject.svg?style=for-the-badge
[stars-url]: https://github.com/POWERARE/PsycareProject/stargazers
[issues-shield]: https://img.shields.io/github/issues/POWERARE/PsycareProject.svg?style=for-the-badge
[issues-url]: https://github.com/POWERARE/PsycareProject/issues
[license-shield]: https://img.shields.io/github/license/POWERARE/PsycareProject.svg?style=for-the-badge
[license-url]: https://github.com/POWERARE/PsycareProject/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
