const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// router.get('/', (req, res) => {
  // find all categories
  router.get('/', async (req, res) => {
    try {
      const categoryData = await Category.findAll();
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  })
  // be sure to include its associated Products
// });

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Category, through: Product, as: 'product_id'}]
    });

    if(!categoryData) {
      res.status(404).json({ message: 'No category found with this id!'});
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
  // find one category by its `id` value

  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;

