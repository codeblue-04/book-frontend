from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

# Sample data (in-memory database for simplicity)
books = [
    {"id": 1, "title": "The Let Them Theory: A Life-Changing Tool That Millions of People Can't Stop Talking About", "author": "Mel Robbins", "image_url": "https://images-na.ssl-images-amazon.com/images/I/91I1KDnK1kL._AC_UL381_SR381,381_.jpg"},
    {"id": 2, "title": "Forgotten Home Apothecary : 250 Powerful Remedies at Your Fingertips", "author": "Dr. Nicole Apelian", "image_url": "https://images-na.ssl-images-amazon.com/images/I/91-E86oM2IL._AC_UL381_SR381,381_.jpg"},
    {"id": 3, "title": "Seven Things You Can't Say About China", "author": "Tom Cotton", "image_url": "https://images-na.ssl-images-amazon.com/images/I/81+mN748qkL._AC_UL381_SR381,381_.jpg"},
    {"id": 4, "title": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones", "author" : "James Clear", "image_url": "https://images-na.ssl-images-amazon.com/images/I/81ANaVZk5LL._AC_UL381_SR381,381_.jpg"}
]

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
MONGO_URI = "mongodb+srv://tomatigurl:<db_password>@cluster0.6waql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["bookstore"]
collection = db["books"]


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Create (POST) operation
@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()

    new_book = {
        "title": data["title"],
        "author": data["author"],
        "image_url": data["image_url"]
    }

    result = collection.insert_one(new_book)
    new_book["_id"] = str(result.inserted_id)
    return jsonify(new_book), 201

# Read (GET) operation - Get all books

@app.route('/books', methods=['GET'])
def get_all_books():
    books = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ObjectId
    return jsonify({"books": books})

# Read (GET) operation - Get a specific book by ID
@app.route('/books/<string:title>', methods=['GET'])
def get_book(title):
    book = collection.find_one({"title": title}, {"_id": 0})  # Exclude ObjectId
    if book:
        return jsonify(book)
    else:
        return jsonify({"error": "Book not found"}), 404

# Update (PUT) operation
@app.route('/books/<string:title>', methods=['PUT'])
def update_book(title):
    data = request.get_json()
    result = collection.update_one({"title": title}, {"$set": data})
    if result.modified_count > 0:
        return jsonify({"message": "Book updated successfully"})
    else:
        return jsonify({"error": "Book not found"}), 404

    
# Delete operation
@app.route('/books/<string:title>', methods=['DELETE'])
def delete_book(title):
    result = collection.delete_one({"title": title})
    if result.deleted_count > 0:
        return jsonify({"message": "Book deleted successfully"})
    else:
        return jsonify({"error": "Book not found"}), 404


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)