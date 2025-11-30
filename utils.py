import hashlib

def hash_song(path):
  hasher = hashlib.sha256()

  for chunk in iter(lambda: path.read(4096), b""):
    hasher.update(chunk)

  return hasher.hexdigest()