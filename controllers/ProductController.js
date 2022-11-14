import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

// menampilkan semua product
export const getProducts = async (req, res) => {
  try {
    let response = await Product.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// menampilkan semua product by id
export const getProductsById = async (req, res) => {
  try {
    let response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// menyimpan product kedatabase
export const saveProducts = (req, res) => {
  if (req.files === null)
    return res.status(404).json({ msg: "Image not found" });

  const name = req.body.title;
  const file = req.files.file;
  // ukuran file
  const fileSize = file.data.length;
  // ekstensi file
  const ext = path.extname(file.name);
  // file yang sudah terenskripsi + ekstensi
  const fileName = file.md5 + ext;
  // url untuk ke DB
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  // ekstensi yang diizinakan
  const allowedExt = [".jpg", ".png", ".jpeg"];
  // cek apakah ekstensi jpg jpeg atau png
  if (!allowedExt.includes(ext.toLowerCase()))
    return res.status(442).json({ msg: "Image extension not allowed" });
  // cek apakah ukuran image tidak lebih dari 5 MB
  if (fileSize > 5000000)
    return res.status(442).json({ msg: "Image must be less than 5 MB" });

  // masukkan gambar ke dalam folder
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Product.create({ name: name, image: fileName, url: url });
      res.status(200).json({ msg: "Product has uploaded" });
    } catch (error) {
      console.log("error karena");
    }
  });
};

// update product
export const updateProducts = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "Data not found" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedExt = [".jpg", ".png", ".jpeg"];

    if (!allowedExt.includes(ext.toLocaleLowerCase()))
      return res.status(442).json({ msg: "Image extension not allowed" });
    if (fileSize > 5000000)
      return res.status(442).json({ msg: "Image must be less than 5 MB" });

    const filePath = `./public/images/${product.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  try {
    await Product.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product has been updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// hapus product
export const deleteProducts = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "Data not found" });
  try {
    // ambil gambar spesifik
    const filePath = `./public/images/${product.image}`;
    // hapus gambar
    fs.unlinkSync(filePath);
    // hapus dari DB
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Product has been deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
