#!/usr/bin/env python3
"""
🚀 MYEx - My Expense Tracker
Setup script for HACKTOWN 2025 project
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="myex-expense-tracker",
    version="1.0.0",
    author="Gabriel Miller",
    author_email="gabriel@hacktown2025.com",
    description="Controle de Gastos Inteligente para Intercâmbio com IA e Reconhecimento de Voz",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/SEU_USUARIO/MYEx",
    project_urls={
        "Bug Tracker": "https://github.com/SEU_USUARIO/MYEx/issues",
        "HACKTOWN 2025": "https://hacktown.com.br",
        "Amazon Q Developer": "https://aws.amazon.com/q/developer/",
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Office/Business :: Financial :: Accounting",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Operating System :: OS Independent",
        "Framework :: Flask",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Topic :: Multimedia :: Sound/Audio :: Speech",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[
        "Flask>=2.3.0",
        "Flask-CORS>=4.0.0",
        "matplotlib>=3.7.0",
        "requests>=2.31.0",
        "colorama>=0.4.4",
        "python-dotenv>=1.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "myex=expense_tracker_voice_fixed:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["templates/*.html", "static/js/*.js", "static/css/*.css"],
    },
    keywords=[
        "expense tracker",
        "voice recognition", 
        "artificial intelligence",
        "currency conversion",
        "travel budget",
        "hacktown 2025",
        "amazon q developer",
        "flask web app",
        "financial management",
        "student exchange"
    ],
    zip_safe=False,
)
