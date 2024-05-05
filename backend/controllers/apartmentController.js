import Apartment from '../models/apartmentModel.js'

const getApartments = async(req, res)=> {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1 ;
    const Keyword = req.query.Keyword ?
    {name: {$regex: req.query.Keyword, $options: 'i'}}:
    {};
    const count = await Apartment.countDocuments({...Keyword});
    const apartments = await Apartment.find({...Keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1));
    res.json({apartments, page, pages: Math.ceil(count/ pageSize)});
}

const getApartmentById = async(req, res)=>{
    const apartment = await Apartment.findById(req.params.id);
    if(apartment){
        return res.json(apartment);
    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
}

const createApartment = async(req, res)=>{
    const apartment = new Apartment({
        category:'sample apartment',
        price: '0',
        image: '',
        user: req.user._id,
        address: 'sample address',
        description: 'sample description',
        numReviews: 0,
        sold: false
    });
    const createdApartment = await apartment.save();
    res.status(201).json(createdApartment)
}

const updateApartment = async(req, res) => {
    const {
        category,
        price,
        description,
        image,
        address,
        sold
    }= req.body;

    const apartment = await Apartment.findById(req.params.id)
}