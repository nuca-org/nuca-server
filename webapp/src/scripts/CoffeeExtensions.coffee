NUCA = {} if !NUCA
NUCA.util = {}

NUCA.util.deepProp = (obj, propName) ->
  subKeys = propName.split('.')
  itemVal = null
  for subKey in subKeys
    itemVal = (itemVal || obj)[subKey]
  return itemVal
  
Array::where = (query) ->

  if (typeof query == "function")
    return @filter query
  
  if (typeof query == "object")
    hit = Object.keys(query).length
    return @filter (item) ->
      match = 0
      for key, val of query
        match += 1 if NUCA.util.deepProp(item, key) == val
      if match is hit then true else false
  
  return @ if !query

  return []

Array::first = (query) ->
  return @where(query)[0]

Array::firstOrDefault = (query) ->
  return @where(query)[0] || {}
  
Array::count = (query) ->
  return @where(query).length

Array::any = (query) ->
  if @where(query).length then true else false

Array::all = (query) ->
  if @where(query).length == @length then true else false

Array::contains = (item) ->
  return @indexOf(item) != -1
  
String::contains = (text) ->
  return @indexOf(text) != -1

String::startsWith = (text) ->
  return @indexOf(text) == 0

String::endsWith = (text) ->
  return @indexOf(text, @length - text.length) != -1
