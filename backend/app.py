from flask import Flask, request, jsonify
import os
import subprocess
import json

app = Flask(__name__)

@app.route('/path/directions')
def get_directions():
    start = request.args.get('start')
    end = request.args.get('end')

    exe_path = os.path.join(os.getcwd(), 'src', 'main.exe')

    result = subprocess.run(
        [exe_path, start, end],  
        capture_output=True,     
        text=True                
    )

    if result.returncode == 0:
        try:
            response_data = json.loads(result.stdout.strip())
            directions = response_data.get('directions', [])
            return jsonify({"directions": directions})
        except json.JSONDecodeError as e:
            return jsonify({"error": "Failed to parse JSON from C++ output"}), 500
    else:
        return jsonify({
            "error": f"Error running C++ program: {result.stderr}"
        }), 500


@app.route('/path/coordinates')
def get_coordinates():
    start = request.args.get('start')
    end = request.args.get('end')

    exe_path = os.path.join(os.getcwd(), 'src', 'main.exe')

    result = subprocess.run(
        [exe_path, start, end],  
        capture_output=True,     
        text=True                
    )

    if result.returncode == 0:
        try:
            response_data = json.loads(result.stdout.strip())
            coordinates = response_data.get('coordinates', [])
            return jsonify({"coordinates": coordinates})
        except json.JSONDecodeError as e:
            return jsonify({"error": "Failed to parse JSON from C++ output"}), 500
    else:
        return jsonify({
            "error": f"Error running C++ program: {result.stderr}"
        }), 500


@app.route('/path/total_distance')
def get_total_distance():
    start = request.args.get('start')
    end = request.args.get('end')

    exe_path = os.path.join(os.getcwd(), 'src', 'main.exe')

    result = subprocess.run(
        [exe_path, start, end],  
        capture_output=True,     
        text=True                
    )

    if result.returncode == 0:
        try:
            response_data = json.loads(result.stdout.strip())
            total_distance = response_data.get('total_distance', None)
            return jsonify({"total_distance": total_distance})
        except json.JSONDecodeError as e:
            return jsonify({"error": "Failed to parse JSON from C++ output"}), 500
    else:
        return jsonify({
            "error": f"Error running C++ program: {result.stderr}"
        }), 500


@app.route('/path/estimated_time')
def get_estimated_time():
    start = request.args.get('start')
    end = request.args.get('end')

    exe_path = os.path.join(os.getcwd(), 'src', 'main.exe')

    result = subprocess.run(
        [exe_path, start, end],  
        capture_output=True,     
        text=True                
    )

    if result.returncode == 0:
        try:
            response_data = json.loads(result.stdout.strip())
            estimated_time = response_data.get('estimated_time', None)
            return jsonify({"estimated_time": estimated_time})
        except json.JSONDecodeError as e:
            return jsonify({"error": "Failed to parse JSON from C++ output"}), 500
    else:
        return jsonify({
            "error": f"Error running C++ program: {result.stderr}"
        }), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)  
