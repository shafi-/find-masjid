import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDPage() {
    const ref = useRef();

    useEffect(() => {
        // Create a scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Create a renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        ref.current.appendChild(renderer.domElement);

        // Load the 2D image as a texture
        const textureLoader = new THREE.TextureLoader();
        // const imageUrl = 'https://www.wallpapers13.com/wp-content/uploads/2016/01/Cool-and-Beautiful-Nature-desktop-wallpaper-image-2560X1600-1600x1200.jpg';
        const imageUrl = '/img/sketch.jpg';
        const texture = textureLoader.load(imageUrl, () => console.log('loaded'), () => console.log('progress'), console.error);

        // Create a plane geometry with the same aspect ratio as the image
        const aspectRatio = texture.image ? texture.image.width / texture.image.height : 16/9;
        const geometry = new THREE.PlaneGeometry(aspectRatio, 1);

        // Create a material with the texture
        const material = new THREE.MeshBasicMaterial({ map: texture });

        // Create a mesh with the geometry and material
        const mesh = new THREE.Mesh(geometry, material);

        // Add the mesh to the scene
        scene.add(mesh);

        // Render the scene
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        return () => {
            // Clean up Three.js objects
            scene.remove(mesh);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={ref} />;
}
